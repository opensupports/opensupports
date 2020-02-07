<?php
use Ifsnop\Mysqldump as IMysqldump;
use Respect\Validation\Validator as DataValidator;

/**
 * @api {get} /system/download Download file
 * @apiVersion 4.6.1
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

        $fileDownloader = FileDownloader::getInstance();
        $fileDownloader->setFileName($fileName);

        $session = Session::getInstance();

        if(!$session->isStaffLogged()) {
            switch($fileDownloader->getFilePermission()) {
                case FileManager::PERMISSION_TICKET:
                    $ticketNumber = $fileDownloader->getTicketNumber();
                    $ticket = Ticket::getByTicketNumber($ticketNumber);
                    if($this->isNotAuthor($ticket, Controller::getLoggedUser())) {
                        return Response::respond403();
                    }
                    break;
                case FileManager::PERMISSION_ARTICLE:
                    if(Controller::isUserSystemEnabled() && !$session->sessionExists()) {
                        return Response::respond403();
                    }
                    break;
                case FileManager::PERMISSION_PROFILE:
                    break;
                default:
                    return Response::respond403();
            }
        }

        $fileDownloader->download();
        exit();
    }

    private function isNotAuthor($ticket, $loggedUser) {
        $session = Session::getInstance();

        if($session->getTicketNumber()) {
            return $session->getTicketNumber() !== $ticket->ticketNumber;
        } else {
            return $ticket->author->id !== $loggedUser->id || ($loggedUser instanceof Staff) !== $ticket->authorToArray()['staff'];
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
