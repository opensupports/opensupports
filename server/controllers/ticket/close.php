<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/close Close a ticket.
 *
 * @apiName Close
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path close a ticket.
 *
 * @apiPermission user
 *
 * @apiParam {Number} ticketNumber The number of a ticket.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TICKET
 * 
 * @apiSuccess {Object} data Empty object
 *
 */

class CloseController extends Controller {
    const PATH = '/close';
    const METHOD = 'POST';

    private $ticket;

    public function validations() {
        return [
            'permission' => 'user',
            'requestData' => [
                'ticketNumber' => [
                    'validation' => DataValidator::validTicketNumber(),
                    'error' => ERRORS::INVALID_TICKET
                ]
            ]
        ];
    }

    public function handler() {
        $this->ticket = Ticket::getByTicketNumber(Controller::request('ticketNumber'));

        if($this->shouldDenyPermission()) {
            Response::respondError(ERRORS::NO_PERMISSION);
            return;
        }

        $this->markAsUnread();
        $this->addCloseEvent();
        $this->ticket->closed = true;

        $this->ticket->store();

        $this->sendMail();
        Log::createLog('CLOSE', $this->ticket->ticketNumber);
        
        Response::respondSuccess();
    }

    private function shouldDenyPermission() {
        $user = Controller::getLoggedUser();

        return (!Controller::isStaffLogged() && $this->ticket->author->id !== $user->id) ||
               (Controller::isStaffLogged() && $this->ticket->owner && $this->ticket->owner->id !== $user->id);
    }

    private function markAsUnread() {
        if(Controller::isStaffLogged()) {
            $this->ticket->unread = true;
        } else {
            $this->ticket->unreadStaff = true;
        }
    }

    private function addCloseEvent() {
        $event = Ticketevent::getEvent(Ticketevent::CLOSE);
        $event->setProperties(array(
            'date' => Date::getCurrentDate()
        ));

        if(Controller::isStaffLogged()) {
            $event->authorStaff = Controller::getLoggedUser();
        } else {
            $event->authorUser = Controller::getLoggedUser();
        }

        $this->ticket->addEvent($event);
    }

    private function sendMail() {
        $mailSender = new MailSender();

        $mailSender->setTemplate(MailTemplate::TICKET_CLOSED, [
            'to' => $this->ticket->author->email,
            'name' => $this->ticket->author->name,
            'ticketNumber' => $this->ticket->ticketNumber,
            'title' => $this->ticket->title,
            'url' => Setting::getSetting('url')->getValue()
        ]);

        $mailSender->send();
    }
}