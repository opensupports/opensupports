<?php

/**
 * @api {post} /system/enable-user-system Enable user system.
 *
 * @apiName Enable user system
 *
 * @apiGroup system
 *
 * @apiDescription This path enable the user system.
 *
 * @apiPermission Staff level 3
 *
 * @apiParam {String} password The password of the current staff.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PASSWORD
 * @apiUse SYSTEM_USER_IS_ALREADY_ENABLED
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class EnableUserSystemController extends Controller {
    const PATH = '/enable-user-system';
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

        if(Controller::isUserSystemEnabled()) {
            throw new Exception(ERRORS::SYSTEM_USER_IS_ALREADY_ENABLED);
        }

        $userSystemEnabled = Setting::getSetting('user-system-enabled');
        $userSystemEnabled->value = 1 ;
        $userSystemEnabled->store();

        $ticketList = Ticket::getAll();

        foreach($ticketList as $ticket) {

            $userInstance = User::getDataStore($ticket->authorEmail, 'email');

            if($userInstance->isNull()) {
                $userInstance = $this->createUser($ticket->authorEmail, $ticket->authorName);
            }

            $userInstance->tickets = $userInstance->tickets + 1;
            $userInstance->sharedTicketList->add($ticket);
            $userInstance->store();

            $ticket->author = $userInstance;
            $ticket->authorName = null;
            $ticket->authorEmail = null;
            $ticket->store();
        }

        Response::respondSuccess();
    }
    public function createUser($email,$name) {
        $userInstance = new User();

        $password = Hashing::generateRandomToken();

        $userInstance->setProperties([
            'name' => $name,
            'signupDate' => Date::getCurrentDate(),
            'tickets' => 0,
            'email' => $email,
            'password' => Hashing::hashPassword($password),
            'verificationToken' => null
        ]);

        $userInstance->store();

        $mailSender = new MailSender();
        $mailSender->setTemplate(MailTemplate::USER_SYSTEM_ENABLED, [
            'to' => $email,
            'name' => $name,
            'password' => $password
        ]);
        $mailSender->send();

        return $userInstance;
    }
}
