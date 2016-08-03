<?php
use Respect\Validation\Validator as DataValidator;

class CreateController extends Controller {
    const PATH = '/create';

    private $title;
    private $content;
    private $departmentId;
    private $language;

    public function validations() {
        return [
            'permission' => 'user',
            'requestData' => [
                'title' => [
                    'validation' => DataValidator::length(3, 30),
                    'error' => ERRORS::INVALID_TITLE
                ],
                'content' => [
                    'validation' => DataValidator::length(10, 500),
                    'error' => ERRORS::INVALID_CONTENT
                ]
            ]
        ];
    }

    public function handler() {
        $this->storeRequestData();
        $this->storeTicket();

        Response::respondSuccess();
    }

    private function storeRequestData() {
        $this->title = Controller::request('title');
        $this->content = Controller::request('content');
        $this->departmentId = Controller::request('departmentId');
        $this->language = Controller::request('language');
    }

    private function storeTicket() {
        $ticket = new Ticket();
        $ticket->setProperties(array(
            'ticketId' => '',
            'title' => $this->title,
            'content' => $this->content,
            'language' => $this->language,
            'department' => $this->departmentId,
            'file' => '',
            'date' => Date::getCurrentDate(),
            'unread' => false,
            'closed' => false
        ));

        $ticket->setAuthor(Controller::getLoggedUser());

        $ticket->store();
    }
}
