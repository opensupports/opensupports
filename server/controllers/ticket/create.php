<?php

class CreateController extends Controller {
    const PATH = '/create';

    private $title ;
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
            return 'title is too short';
        }
        if (strlen($this->title) > 30) {
            return 'title is very long';
        }
        if (strlen($this->content) < 5) {
            return 'content is too short';
        }
        if (strlen($this->content) > 500) {
            return 'content is very long';
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