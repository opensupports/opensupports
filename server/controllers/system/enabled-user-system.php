<?php

class EnabledUserSystemController extends Controller {
    const PATH = '/enabled-user-system';

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

        if(Controller::isUserSystemEnabled()) {
            throw new Exception(ERRORS::SYSTEM_USER_IS_ALREADY_ENABLED);
        }

        $userSystemEnabled = Setting::getSetting('user-system-enabled');
        $userSystemEnabled->value = 1 ;
        $userSystemEnabled->store();

        $ticketList = Ticket::getAll();

        foreach($ticketList as $ticket) {

            $userRow = User::getDataStore($ticket->authorEmail, 'email');

            if($userRow->isNull()) {
                $userInstance = new User();

                $password = Hashing::generateRandomToken();

                $userInstance->setProperties([
                    'name' => $ticket->authorName,
                    'signupDate' => Date::getCurrentDate(),
                    'tickets' => 1,
                    'email' => $ticket->authorEmail,
                    'password' => Hashing::hashPassword($password),
                    'verificationToken' => null
                ]);

                $userInstance->store();

                $mailSender = new MailSender();
                $mailSender->setTemplate(MailTemplate::USER_SYSTEM_ENABLED, [
                    'to' => $ticket->authorEmail,
                    'name' => $ticket->authorName,
                    'password' => $password
                ]);
                $mailSender->send();

            } else {
                $userRow->tickets = $userRow->tickets + 1;
                $userRow->sharedTicketList->add($ticket);
                $userRow->store();
            }

            $actualUserRow = User::getDataStore($ticket->authorEmail,'email');
            $ticket->author = $actualUserRow;
            $ticket->authorName = null;
            $ticket->authorEmail = null;
            $ticket->store();
        }

        Response::respondSuccess();
    }
}