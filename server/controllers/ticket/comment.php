<?php
use RedBeanPHP\Facade as RedBean;

class CommentController extends Controller {
    const PATH = '/comment';

    private $ticketId;
    private $content;

    public function handler() {
        /*
        //$this->storeComment();
        $ticket = RedBean::load('tickets', Controller::request('ticketId'));
        $comment = RedBean::dispense('comments');
        $comment->content = Controller::request('content');

        $ticket->ownCommentsList[] = $comment;

        RedBean::store($ticket);
        $ticket = RedBean::load('tickets', Controller::request('ticketId'));

        $string = "";
        $string += count($ticket->ownCommentsList);

        foreach( $ticket->ownCommentsList as $comment2 ) {
        }*/
    }

    private function storeComment() {
        $this->ticketId = Controller::request('ticketId');
        $this->content = Controller::request('content');
        $ticket = Ticket::getTicket($this->ticketId);

        $comment = new Comment();
        $comment->setProperties(array(
            'content' => $this->content
            //'ticket' => $ticket->getBeanInstance()
        ));

        $ticket->getBeanInstance()->ownCommentsList = [$comment->getBeanInstance()];
        $ticket->store();
        $ticket = Ticket::getTicket($this->ticketId);
        Response::respondError(count($ticket->ownCommentsList));
    }
}