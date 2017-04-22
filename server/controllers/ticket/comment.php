<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/comment Comment a ticket.
 *
 * @apiName Comment
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path comment a ticket.
 *
 * @apiPermission user
 *
 * @apiParam {String} content Content of the comment.
 * @apiParam {Number} ticketNumber The number of the ticket to comment.
 * @apiParam {String} csrf_token Token of the session.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_CONTENT
 * @apiUse INVALID_TICKET
 *
 * @apiSuccess {Object} data Empty object 
 *
 */

class CommentController extends Controller {
    const PATH = '/comment';
    const METHOD = 'POST';

    private $ticket;
    private $content;

    public function validations() {
        $session = Session::getInstance();

        if (Controller::isUserSystemEnabled() || Controller::isStaffLogged()) {
            return [
                'permission' => 'user',
                'requestData' => [
                    'content' => [
                        'validation' => DataValidator::length(20, 5000),
                        'error' => ERRORS::INVALID_CONTENT
                    ],
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
                    'content' => [
                        'validation' => DataValidator::length(20, 5000),
                        'error' => ERRORS::INVALID_CONTENT
                    ],
                    'ticketNumber' => [
                        'validation' => DataValidator::equals($session->getTicketNumber()),
                        'error' => ERRORS::INVALID_TICKET
                    ],
                    'csrf_token' => [
                        'validation' => DataValidator::equals($session->getToken()),
                        'error' => Controller::request('csrf_token') . ' ' . $session->getToken()

                    ]
                ]
            ];
        }
    }

    public function handler() {
        $session = Session::getInstance();
        $this->requestData();

        if ((!Controller::isUserSystemEnabled() && !Controller::isStaffLogged()) || $session->isLoggedWithId(($this->ticket->author) ? $this->ticket->author->id : 0) || (Controller::isStaffLogged() && $session->isLoggedWithId(($this->ticket->owner) ? $this->ticket->owner->id : 0))) {
            $this->storeComment();

            if(Controller::isStaffLogged()) {
                $this->sendMail();
            }

            Log::createLog('COMMENT', $this->ticket->ticketNumber);
            
            Response::respondSuccess();
        } else {
            Response::respondError(ERRORS::NO_PERMISSION);
        }
    }

    private function requestData() {
        $ticketNumber = Controller::request('ticketNumber');
        $this->ticket = Ticket::getByTicketNumber($ticketNumber);
        $this->content = Controller::request('content', true);
    }

    private function storeComment() {
        $fileUploader = $this->uploadFile();

        $comment = Ticketevent::getEvent(Ticketevent::COMMENT);
        $comment->setProperties(array(
            'content' => $this->content,
            'file' => ($fileUploader instanceof FileUploader) ? $fileUploader->getFileName() : null,
            'date' => Date::getCurrentDate()
        ));

        if(Controller::isStaffLogged()) {
            $this->ticket->unread = true;
            $comment->authorStaff = Controller::getLoggedUser();
        } else if(Controller::isUserSystemEnabled()) {
            $this->ticket->unreadStaff = true;
            $comment->authorUser = Controller::getLoggedUser();
        }

        $this->ticket->addEvent($comment);
        $this->ticket->store();
    }

    private function sendMail() {
        $mailSender = new MailSender();

        $mailSender->setTemplate(MailTemplate::TICKET_RESPONDED, [
            'to' => ($this->ticket->author) ? $this->ticket->author->email : $this->ticket->authorEmail,
            'name' => ($this->ticket->author) ? $this->ticket->author->name : $this->ticket->authorName,
            'ticketNumber' => $this->ticket->ticketNumber,
            'title' => $this->ticket->title,
            'url' => Setting::getSetting('url')->getValue()
        ]);

        $mailSender->send();
    }
}