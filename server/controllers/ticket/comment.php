<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class CommentController extends Controller {
    const PATH = '/comment';

    private $ticket;
    private $content;

    public function validations() {
        $validations = [
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
        
        if(!Controller::isUserSystemEnabled()) {
            $validations['permission'] = 'any';
            $validations['requestData']['email'] = [
                'validation' => DataValidator::email(),
                'error' => ERRORS::INVALID_EMAIL
            ];
        }
        
        return $validations;
    }

    public function handler() {
        $session = Session::getInstance();
        $this->requestData();

        if (!Controller::isUserSystemEnabled() || $session->isLoggedWithId($this->ticket->author->id) || Controller::isStaffLogged()) {
            $this->storeComment();
            
            Log::createLog('COMMENT', $this->ticket->ticketNumber);
            
            Response::respondSuccess();
        } else {
            Response::respondError(ERRORS::NO_PERMISSION);
        }
    }

    private function requestData() {
        $ticketNumber = Controller::request('ticketNumber');
        $email = Controller::request('email');
        $this->ticket = Ticket::getByTicketNumber($ticketNumber);
        $this->content = Controller::request('content');
        
        if(!Controller::isUserSystemEnabled() && $this->ticket->authorEmail !== $email && !Controller::isStaffLogged()) {
            throw new Exception(ERRORS::NO_PERMISSION);
        }
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
}