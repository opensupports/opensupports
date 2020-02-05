<?php

/**
 * @api {post} /system/disable-user-system Disable user system
 * @apiVersion 4.6.1
 *
 * @apiName Disable user system
 *
 * @apiGroup System
 *
 * @apiDescription This path disables the user system.
 *
 * @apiPermission staff3
 *
 * @apiParam {String} password The password of the current staff.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PASSWORD
 * @apiUse SYSTEM_USER_IS_ALREADY_DISABLED
 *
 * @apiSuccess {Object} data Empty object
 *
 */

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
            throw new RequestException(ERRORS::INVALID_PASSWORD);

        }

        if(!Controller::isUserSystemEnabled()) {
            throw new RequestException(ERRORS::SYSTEM_USER_IS_ALREADY_DISABLED);
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

            $mailSender = MailSender::getInstance();

            $mailSender->setTemplate(MailTemplate::USER_SYSTEM_DISABLED, [
                'to' => $user->email,
                'name' => $user->name,
                'tickets' => $ticketNumberList,
                'url' => Setting::getSetting('url')->getValue()
            ]);

            $mailSender->send();

            $user->delete();
        }

        Response::respondSuccess();
    }
}
