<?php
use Respect\Validation\Validator as DataValidator;

class ReOpenController extends Controller {
    const PATH = '/re-open';

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
        $this->addReopenEvent();
        $this->ticket->closed = false;

        $this->ticket->store();

        Log::createLog('RE_OPEN', $this->ticket->ticketNumber);

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

    private function addReopenEvent() {
        $event = Ticketevent::getEvent(Ticketevent::RE_OPEN);
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
}