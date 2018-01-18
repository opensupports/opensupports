<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/create Create ticket
 * @apiVersion 4.1.0
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
 * @apiParam {String} name The Name of the author of the ticket.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TITLE
 * @apiUse INVALID_CONTENT
 * @apiUse INVALID_DEPARTMENT
 * @apiUse INVALID_LANGUAGE
 * @apiUse INVALID_CAPTCHA
 * @apiUse INVALID_EMAIL
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
                    'validation' => DataValidator::length(10, 200),
                    'error' => ERRORS::INVALID_TITLE
                ],
                'content' => [
                    'validation' => DataValidator::length(10, 5000),
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

        if(!Controller::isUserSystemEnabled()) {
            $validations['permission'] = 'any';
            $validations['requestData']['captcha'] = [
                'validation' => DataValidator::captcha(),
                'error' => ERRORS::INVALID_CAPTCHA
            ];
            $validations['requestData']['email'] = [
                'validation' => DataValidator::email(),
                'error' => ERRORS::INVALID_EMAIL
            ];
        }

        return $validations;
    }

    public function handler() {
        $this->title = htmlentities(Controller::request('title'));
        $this->content = htmlentities(Controller::request('content', true));
        $this->departmentId = Controller::request('departmentId');
        $this->language = Controller::request('language');
        $this->email = Controller::request('email');
        $this->name = Controller::request('name');

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

        Log::createLog('CREATE_TICKET', $this->ticketNumber);
        Response::respondSuccess([
            'ticketNumber' => $this->ticketNumber
        ]);
    }

    private function storeTicket() {
        $department = Department::getDataStore($this->departmentId);
        $author = Controller::getLoggedUser();

        $fileUploader = $this->uploadFile();

        $ticket = new Ticket();
        $ticket->setProperties(array(
            'title' => $this->title,
            'content' => $this->content,
            'language' => $this->language,
            'author' => $author,
            'department' => $department,
            'file' => ($fileUploader instanceof FileUploader) ? $fileUploader->getFileName() : null,
            'date' => Date::getCurrentDate(),
            'unread' => false,
            'unreadStaff' => true,
            'closed' => false,
            'authorName' => $this->name,
            'authorEmail' => $this->email
        ));

        if(Controller::isUserSystemEnabled()) {
            $author->sharedTicketList->add($ticket);
            $author->tickets++;

            $this->email = $author->email;
            $this->name = $author->name;

            $author->store();
        }

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
