<?php
use RedBeanPHP\Facade as RedBean;

class CommentController extends Controller {
    const PATH = '/comment';

    private $ticketId;
    private $content;

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        $this->requestData();
        $this->storeComment();

        Response::respondSuccess();
    }

    private function requestData() {
        $this->ticketId = Controller::request('ticketId');
        $this->content = Controller::request('content');
    }

    private function storeComment() {
        $comment = new Comment();
        $comment->setProperties(array(
            'content' => $this->content
        ));

        $ticket = Ticket::getTicket($this->ticketId);
        $ticket->addComment($comment);
        $ticket->store();
    }
}