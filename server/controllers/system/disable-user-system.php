<?php

class DisableUserSystemController extends Controller {
    const PATH = '/disable-user-system';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }

    public function handler() {
        $password = Controller::request('password');

        if(!Hashing::verifyPassword($password, Controller::getLoggedUser()->password)) {
            throw new Exception(ERRORS::INVALID_PASSWORD);

        }

        if(!Controller::isUserSystemEnabled()) {
            throw new Exception(ERRORS::SYSTEM_USER_IS_ALREADY_DISABLED);
        }

        $userSystemEnabled = Setting::getSetting('user-system-enabled');
        $userSystemEnabled->value = 0 ;
        $userSystemEnabled->store();

        $userList = User::getAll();

        foreach($userList as $user) {
            $ticketNumberList = '';
            
            foreach($user->sharedTicketList as $ticket) {
                $ticket->authorEmail = $user->email;
                $ticket->authorName = $user->name;
                $ticket->author = null;
                
                $ticketNumberList .= $ticket->ticketNumber . ' - ' . $ticket->title . '<br />';
                $ticket->store();
            }

            $mailSender = new MailSender();

            $mailSender->setTemplate(MailTemplate::USER_SYSTEM_DISABLED, [
                'to' => $user->email,
                'name' => $user->name,
                'tickets' => $ticketNumberList
            ]);

            $mailSender->send();
            
            $user->delete();
        }
        
        Response::respondSuccess();
    }
}