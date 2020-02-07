<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/create Create ticket
 * @apiVersion 4.6.1
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
 * @apiParam {String} email The email of the user who created the ticket.
 * @apiParam {Number} images The number of images in the content
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

    public function validations() {
        $validations = [
            'permission' => 'user',
            'requestData' => [
                'title' => [
                    'validation' => DataValidator::notBlank()->length(1, 200),
                    'error' => ERRORS::INVALID_TITLE
                ],
                'content' => [
                    'validation' => DataValidator::content(),
                    'error' => ERRORS::INVALID_CONTENT
                ],
                'departmentId' => [
                    'validation' => DataValidator::dataStoreId('department'),
                    'error' => ERRORS::INVALID_DEPARTMENT
                ],
                'language' => [
                    'validation' => DataValidator::in(Language::getSupportedLanguages()),
                    'error' => ERRORS::INVALID_LANGUAGE
                ]
            ]
        ];

        if(!Controller::isUserSystemEnabled() && !Controller::isStaffLogged()) {
            $validations['permission'] = 'any';
            $validations['requestData']['captcha'] = [
                'validation' => DataValidator::captcha(APIKey::TICKET_CREATE),
                'error' => ERRORS::INVALID_CAPTCHA
            ];
            $validations['requestData']['email'] = [
                'validation' => DataValidator::email(),
                'error' => ERRORS::INVALID_EMAIL
            ];
            $validations['requestData']['name'] = [
                'validation' => DataValidator::notBlank()->length(2, 40),
                'error' => ERRORS::INVALID_NAME
            ];
        }

        return $validations;
    }

    public function handler() {
        $this->title = Controller::request('title');
        $this->content = Controller::request('content', true);
        $this->departmentId = Controller::request('departmentId');
        $this->language = Controller::request('language');
        $this->email = Controller::request('email');
        $this->name = Controller::request('name');

        if(!Controller::isStaffLogged() && Department::getDataStore($this->departmentId)->private){
            throw new Exception(ERRORS::INVALID_DEPARTMENT);
        }
        $this->storeTicket();

        if(!Controller::isUserSystemEnabled()) {
            $this->sendMail();
        }

        $staffs = Staff::find('send_email_on_new_ticket = 1');
        foreach ($staffs as $staff) {
            if($staff->sharedDepartmentList->includesId(Controller::request('departmentId'))) {
                $this->sendMailStaff($staff->email);
            }
        }

        Response::respondSuccess([
            'ticketNumber' => $this->ticketNumber
        ]);

        if(!Controller::isUserSystemEnabled() && !Controller::isStaffLogged()) {
            $session = Session::getInstance();
            $session->createTicketSession($this->ticketNumber);
        }
        
        Log::createLog('CREATE_TICKET', $this->ticketNumber);
    }

    private function storeTicket() {
        $department = Department::getDataStore($this->departmentId);
        $author = Controller::getLoggedUser();
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
        ));

        $ticket->setAuthor($author);

        if(Controller::isUserSystemEnabled() || Controller::isStaffLogged()) {
            $author->sharedTicketList->add($ticket);
        }

        if(Controller::isUserSystemEnabled() && !Controller::isStaffLogged()) {
            $author->tickets++;

            $this->email = $author->email;
            $this->name = $author->name;
        }

        $author->store();
        $ticket->store();

        $this->ticketNumber = $ticket->ticketNumber;
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
