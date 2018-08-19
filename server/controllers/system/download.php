<?php
use Ifsnop\Mysqldump as IMysqldump;
use Respect\Validation\Validator as DataValidator;

/**
 * @api {get} /system/download Download file
 * @apiVersion 4.2.0
 *
 * @apiName Download file
 *
 * @apiGroup System
 *
 * @apiDescription This path downloads a file.
 *
 * @apiPermission any
 *
 * @apiParam {String} file The filename to be downloaded.
 *
 * @apiError 403 You have no permission to access the file.
 *
 * @apiSuccess {Object} file File content
 *
 */

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
        $isStaffProfilePic = !Staff::getDataStore($fileName, 'profilePic')->isNull();

        if(!$isStaffProfilePic) {
            $session = Session::getInstance();
            $loggedUser = Controller::getLoggedUser();

            if(!$session->sessionExists()) {
                Response::respond403();
                return;
            }

            $ticket = Ticket::getTicket($fileName, 'file');

            if($ticket->isNull() || ($this->isNotAuthor($ticket, $loggedUser) && $this->isNotDepartmentOwner($ticket, $loggedUser))) {
                $ticketEvent = Ticketevent::getDataStore($fileName, 'file');

                if($ticketEvent->isNull()) {
                    Response::respond403();
                    return;
                }

                $ticket = $ticketEvent->ticket;

                if($this->isNotAuthor($ticket, $loggedUser) && $this->isNotDepartmentOwner($ticket, $loggedUser)) {
                    Response::respond403();
                    return;
                }
            }
        }

        $fileDownloader = FileDownloader::getInstance();
        $fileDownloader->setFileName($fileName);
        $fileDownloader->download();
        exit();
    }

    private function isNotAuthor($ticket, $loggedUser) {
        $session = Session::getInstance();

        if($session->getTicketNumber()) {
            return $session->getTicketNumber() !== $ticket->ticketNumber;
        } else {
            return $loggedUser->level >= 1 || $ticket->author->id !== $loggedUser->id;
        }
    }

    private function isNotDepartmentOwner($ticket, $loggedUser) {
        $session = Session::getInstance();

        if($session->getTicketNumber()) {
            return $session->getTicketNumber() !== $ticket->ticketNumber;
        } else {
            return !($loggedUser->level >= 1) || !$loggedUser->sharedDepartmentList->includesId($ticket->department->id);
        }
    }
}
