<?php
use RedBeanPHP\Facade as RedBean;

class CreateController extends Controller {
    const PATH = '/create';

    private $title;
    private $content;
    private $departmentId;
    private $language;

    public function handler() {
        $this->requestTicketData();

        $validateResult = $this->validateData();

        if ($validateResult !== true) {
            Response::respondError($validateResult);
        } else {
            $this->storeTicket();

            Response::respondSuccess();
        }
    }

    private function requestTicketData() {
        $this->title = Controller::request('title');
        $this->content = Controller::request('content');
        $this->departmentId = Controller::request('departmentId');
        $this->language = Controller::request('language');
    }

    private function validateData() {
        if (strlen($this->title) < 3) {
            return ERRORS::SHORT_TITLE;
        }
        if (strlen($this->title) > 30) {
            return ERRORS::LONG_TITLE;
        }
        if (strlen($this->content) < 5) {
            return ERRORS::SHORT_CONTENT;
        }
        if (strlen($this->content) > 500) {
            return ERRORS::LONG_CONTENT;
        }

        return true;
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
            'date' => date("F j, Y, g:i a"),
            'unread' => false,
            'closed' => false,
            'author' => '',
            'owner'=> '',
            'ownComments' => []
        ));
        $ticket->store();
    }
}