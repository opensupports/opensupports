<?php

class CreateController extends Controller {
    const PATH = '/create';

    public function handler(){
        $title = Controller::request('title');
        $content = Controller::request('content');
        $departmentId = Controller::request('departmentId');
        $language = Controller::request('language');
        if (strlen($title)<3 ){
            Response::respondError('title is so short');
            return;
        }
        if (strlen($title)>30){
            Response::respondError('title is so long');
            return;
        }
        if (strlen($content)<5){
            Response::respondError('content is so short');
            return;
        }
        if (strlen($content)>100){
            Response::respondError('content is so long');
            return;
        }
        $ticket = new Ticket();
        $ticket->setProperties(array(
            'ticketId' => '',
            'title' => $title,
            'content' => $content,
            'language' => $language,
            'department' => $departmentId,
            'file' => '',
            'date' => date("F j, Y, g:i a"),
            'unread' => false,
            'closed' => false,
            'author' => '',
            'owner'=> '',
            'ownComments' => []
        ));

        $ticket->store();
        Response::respondSuccess();

    }
}