<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/close Close ticket
 * @apiVersion 4.6.1
 *
 * @apiName Close
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path closes a ticket.
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
        $session = Session::getInstance();

        if (Controller::isUserSystemEnabled() || Controller::isStaffLogged()) {
            return [
                'permission' => 'user',
                'requestData' => [
                    'ticketNumber' => [
                        'validation' => DataValidator::validTicketNumber(),
                        'error' => ERRORS::INVALID_TICKET
                    ]
                ]
            ];
        } else {
            return [
                'permission' => 'any',
                'requestData' => [
                    'ticketNumber' => [
                        'validation' => DataValidator::equals($session->getTicketNumber()),
                        'error' => ERRORS::INVALID_TICKET
                    ],
                    'csrf_token' => [
                        'validation' => DataValidator::equals($session->getToken()),
                    	'error' => ERRORS::INVALID_TOKEN
                    ]
                ]
            ];
        }
    }

    public function handler() {
        $this->ticket = Ticket::getByTicketNumber(Controller::request('ticketNumber'));
        $user = Controller::getLoggedUser();

        if(!Controller::isStaffLogged() && Controller::isUserSystemEnabled() &&
           !$user->canManageTicket($this->ticket)){
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        if(Controller::isStaffLogged() && (!$user->canManageTicket($this->ticket))){
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        $this->markAsUnread();
        $this->addCloseEvent();
        $this->ticket->closed = true;

        $this->ticket->store();

        $this->sendMail();
        Log::createLog('CLOSE', $this->ticket->ticketNumber);

        Response::respondSuccess();
    }

    private function markAsUnread() {
        $this->ticket->unread = !$this->ticket->isAuthor(Controller::getLoggedUser());
        $this->ticket->unreadStaff = !$this->ticket->isOwner(Controller::getLoggedUser());
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
        $mailSender = MailSender::getInstance();

        $mailSender->setTemplate(MailTemplate::TICKET_CLOSED, [
            'to' => ($this->ticket->author) ? $this->ticket->author->email : $this->ticket->authorEmail,
            'name' => ($this->ticket->author) ? $this->ticket->author->name : $this->ticket->authorName,
            'ticketNumber' => $this->ticket->ticketNumber,
            'title' => $this->ticket->title,
            'url' => Setting::getSetting('url')->getValue()
        ]);

        $mailSender->send();
    }
}
