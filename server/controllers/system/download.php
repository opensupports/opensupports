<?php
use Ifsnop\Mysqldump as IMysqldump;
use Respect\Validation\Validator as DataValidator;

class DownloadController extends Controller {
    const PATH = '/download';
    const METHOD = 'GET';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => [
                'file' => [
                    'validation' => DataValidator::alnum('_.-')->noWhitespace(),
                    'error' => ERRORS::INVALID_FILE
                ]
            ]
        ];
    }

    public function handler() {
        $fileName = Controller::request('file');
        $staffUser = Staff::getDataStore($fileName, 'profilePic');

        if($staffUser->isNull()) {
            $session = Session::getInstance();
            $loggedUser = Controller::getLoggedUser();

            if(!$session->sessionExists()) {
                print '';
                return;
            }

            $ticket = Ticket::getTicket($fileName, 'file');

            if($ticket->isNull() || ($this->isNotAuthor($ticket, $loggedUser) && $this->isNotOwner($ticket, $loggedUser))) {
                $ticketEvent = Ticketevent::getDataStore($fileName, 'file');

                if($ticketEvent->isNull()) {
                    print '';
                    return;
                }

                $ticket = $ticketEvent->ticket;

                if($this->isNotAuthor($ticket, $loggedUser) && $this->isNotOwner($ticket, $loggedUser)) {
                    print '';
                    return;
                }
            }
        }

        $fileDownloader = FileDownloader::getInstance();
        $fileDownloader->setFileName($fileName);
        $fileDownloader->download();
    }

    private function isNotAuthor($ticket, $loggedUser) {
        $session = Session::getInstance();

        if($session->getTicketNumber()) {
            return $session->getTicketNumber() !== $ticket->ticketNumber;
        } else {
            return Controller::getLoggedUser()->level >= 1 || $ticket->author->id !== $loggedUser->id;
        }
    }

    private function isNotOwner($ticket, $loggedUser) {
        $session = Session::getInstance();

        if($session->getTicketNumber()) {
            return $session->getTicketNumber() !== $ticket->ticketNumber;
        } else {
            return !(Controller::getLoggedUser()->level >= 1) || !$ticket->owner || $ticket->owner->id !== $loggedUser->id;
        }
    }
}