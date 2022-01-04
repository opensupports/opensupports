<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/create Create ticket
 * @apiVersion 4.11.0
 *
 * @apiName Create ticket
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path creates a new ticket.
 *
 * @apiPermission user
 *
 * @apiParam {String} title Title of the ticket.
 * @apiParam {String} content Content of the ticket.
 * @apiParam {Number} departmentId The id of the department of the current ticket.
 * @apiParam {String} language The language of the ticket.
 * @apiParam {String} name The name of author of the ticket.
 * @apiParam {String} email The email of the user who created the ticket.
 * @apiParam {Number} images The number of images in the content.
 * @apiParam {String} apiKey apiKey to create tickets and show ticket-number created.
 * @apiParam image_i The image file of index `i` (mutiple params accepted)
 * @apiParam file The file you with to upload.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TITLE
 * @apiUse INVALID_CONTENT
 * @apiUse INVALID_DEPARTMENT
 * @apiUse INVALID_LANGUAGE
 * @apiUse INVALID_CAPTCHA
 * @apiUse INVALID_EMAIL
 * @apiUse INVALID_FILE
 *
 * @apiSuccess {Object} data Information of the new ticket
 * @apiSuccess {Number} data.ticketNumber Number of the new ticket
 *
 */

class CreateController extends Controller {
    const PATH = '/create';
    const METHOD = 'POST';

    private $title;
    private $content;
    private $departmentId;
    private $language;
    private $ticketNumber;
    private $email;
    private $name;
    private $apiKey;
    public function validations() {
        $validations = [
            'permission' => 'user',
            'requestData' => [
                'title' => [
                    'validation' => DataValidator::notBlank()->length(LengthConfig::MIN_LENGTH_TITLE, LengthConfig::MAX_LENGTH_TITLE),
                    'error' => ERRORS::INVALID_TITLE
                ],
                'content' => [
                    'validation' => DataValidator::content(),
                    'error' => ERRORS::INVALID_CONTENT
                ],
                'departmentId' => [
                    'validation' => DataValidator::oneOf(DataValidator::dataStoreId('department'), DataValidator::nullType()),
                    'error' => ERRORS::INVALID_DEPARTMENT
                ],
                'language' => [
                    'validation' => DataValidator::oneOf(DataValidator::in(Language::getSupportedLanguages()), DataValidator::nullType()),
                    'error' => ERRORS::INVALID_LANGUAGE
                ]
            ]
        ];
        if (!Controller::isLoginMandatory() && !Controller::isStaffLogged() && !Controller::isUserLogged()) {
            $validations['permission'] = 'any';
            $validations['requestData']['captcha'] = [
                'validation' => DataValidator::captcha(APIKey::TICKET_CREATE_PERMISSION),
                'error' => ERRORS::INVALID_CAPTCHA
            ];
            $validations['requestData']['email'] = [
                'validation' => DataValidator::email(),
                'error' => ERRORS::INVALID_EMAIL
            ];
            $validations['requestData']['name'] = [
                'validation' => DataValidator::notBlank()->length(LengthConfig::MIN_LENGTH_NAME, LengthConfig::MAX_LENGTH_NAME),
                'error' => ERRORS::INVALID_NAME
            ];
        }

        return $validations;
    }

    public function handler() {
        
        $session = Session::getInstance();
        if($session->isTicketSession())  {
            $session->clearSessionData();
        }

        $this->title = Controller::request('title', true);
        $this->content = Controller::request('content', true);
        $this->departmentId = Controller::request('departmentId');
        $this->language = Controller::request('language');
        $this->email = Controller::request('email');
        $this->name = Controller::request('name');
        $this->apiKey = APIKey::getDataStore(Controller::request('apiKey'), 'token');
        
        if(!Controller::isStaffLogged() && Department::getDataStore($this->departmentId)->private) {
            throw new Exception(ERRORS::INVALID_DEPARTMENT);
        }
        
        if(!Staff::getUser($this->email,'email')->isNull() || $this->isEmailInvalid()) {
            throw new Exception(ERRORS::INVALID_EMAIL);
        }
        
        if(!Controller::isLoginMandatory() && !Controller::isStaffLogged() && !Controller::isUserLogged()  && User::getUser($this->email, 'email')->isNull()){
            $this->createNewUser();
        }
        
        $this->storeTicket();

        if(!Controller::isLoginMandatory() && !Controller::isUserLogged()) {
            $this->sendMail();
        }

        $staffs = Staff::find('send_email_on_new_ticket = 1');
        foreach ($staffs as $staff) {
            if($staff->sharedDepartmentList->includesId(Controller::request('departmentId'))) {
                $this->sendMailStaff($staff->email);
            }
        }
        
        Log::createLog('CREATE_TICKET', $this->ticketNumber);
        
        if(!$this->apiKey->isNull() && $this->apiKey->shouldReturnTicketNumber){
            Response::respondSuccess([
                'ticketNumber' => $this->ticketNumber
            ]);
        }else{
            Response::respondSuccess();
        }
    }

    private function isEmailInvalid(){
        $session = Session::getInstance();
        $sessionUser = User::getUser($session->getUserId() ,'id');

        return  ($session->sessionExists() && $sessionUser  &&  $this->email && !($sessionUser->email == $this->email));
    }

    private function createNewUser() {
        
        $signupController = new SignUpController(true);
        
        Controller::setDataRequester(function ($key) {
            switch ($key) {
                case 'email':
                    return $this->email;
                case 'password':
                    return Hashing::generateRandomToken();
                case 'name':
                    return $this->name;
                case 'indirectSignUp' : 
                    return true;
            }

            return null;
        });
        $signupController->validations();
        $signupController->handler();
    }

    private function storeTicket() {
        $department = Department::getDataStore($this->getCorrectDepartmentId());
        $author = $this->getAuthor();
        $this->language = $this->getCorrectLanguage();

        $ticket = new Ticket();

        $fileUploader = FileUploader::getInstance();
        $fileUploader->setPermission(FileManager::PERMISSION_TICKET, $ticket->generateUniqueTicketNumber());

        $imagePaths = $this->uploadImages(Controller::isStaffLogged());
        $fileUploader = $this->uploadFile(Controller::isStaffLogged());

        $ticket->setProperties(array(
            'title' => $this->title,
            'content' => $this->replaceWithImagePaths($imagePaths, $this->content),
            'language' => $this->language,
            'department' => $department,
            'file' => ($fileUploader instanceof FileUploader) ? $fileUploader->getFileName() : null,
            'date' => Date::getCurrentDate(),
            'unread' => false,
            'unreadStaff' => true,
            'closed' => false,
            'authorName' => $this->name,
            'authorEmail' => $this->email,
            'totalDepartments' => 0,
            'totalOwners' => 0
        ));

        $ticket->setAuthor($author);
        $author->sharedTicketList->add($ticket);

        if(!Controller::isStaffLogged()) {
            $author->tickets++;

            $this->email = $author->email;
            $this->name = $author->name;
        }

        $author->store();
        $ticket->store();

        $this->ticketNumber = $ticket->ticketNumber;
    }

    private function getCorrectLanguage() {
        if($this->language){
            return $this->language;
        }else{
            return Setting::getSetting('language')->getValue();
        }
    }
    
    private function getCorrectDepartmentId(){
        $defaultDepartmentId = Setting::getSetting('default-department-id')->getValue();
        $isLocked = Setting::getSetting('default-is-locked')->getValue();
        $validDepartment = Department::getDataStore($defaultDepartmentId)->id; 
        if (Controller::isStaffLogged()) {
            if ($this->departmentId) $validDepartment = $this->departmentId;
        } else {
            if (!$isLocked && $this->departmentId) $validDepartment = $this->departmentId;
        }
        return $validDepartment;
    }

    private function getAuthor() {
        if (!Controller::getLoggedUser()->isNull()) { 
            return Controller::getLoggedUser();
        } else {
            return User::getUser($this->email, 'email');
        }
    }

    private function sendMail() {
        $mailSender = MailSender::getInstance();

        $mailSender->setTemplate(MailTemplate::TICKET_CREATED, [
            'to' => $this->email,
            'name' => $this->name,
            'ticketNumber' => $this->ticketNumber,
            'title' => $this->title,
            'url' => Setting::getSetting('url')->getValue()
        ]);

        $mailSender->send();
    }

    private function sendMailStaff($email) {
        $mailSender = MailSender::getInstance();

        $mailSender->setTemplate(MailTemplate::TICKET_CREATED_STAFF, [
            'to' => $email,
            'name' => $this->name,
            'ticketNumber' => $this->ticketNumber,
            'title' => $this->title
        ]);

        $mailSender->send();
    }
}
