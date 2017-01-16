<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class CreateController extends Controller {
    const PATH = '/create';

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
        }
        
        return $validations;
    }

    public function handler() {
        $this->title = Controller::request('title');
        $this->content = Controller::request('content');
        $this->departmentId = Controller::request('departmentId');
        $this->language = Controller::request('language');
        $this->email = Controller::request('email');
        $this->name = Controller::request('name');

        $this->storeTicket();

        Log::createLog('CREATE_TICKET', $this->ticketNumber);
        Response::respondSuccess([
            'ticketNumber' => $this->ticketNumber
        ]);
    }

    private function storeTicket() {
        $department = Department::getDataStore($this->departmentId);
        $author = Controller::getLoggedUser();

        $ticket = new Ticket();
        $ticket->setProperties(array(
            'title' => $this->title,
            'content' => $this->content,
            'language' => $this->language,
            'author' => $author,
            'department' => $department,
            'file' => '',
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

            $author->store();    
        }
        
        $ticket->store();
        
        $this->ticketNumber = $ticket->ticketNumber;
    }
}
