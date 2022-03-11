<?php
use Ifsnop\Mysqldump as IMysqldump;
use Respect\Validation\Validator as DataValidator;

/**
 * @api {get} /system/download Download file
 * @apiVersion 4.11.0
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

        $allowed = array('https://maxi.ticketcenter.cloud');

        if(isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed)){
            header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN'] . "");
        } else if (isset($_SERVER['HTTP_REFERER']) && in_array($_SERVER['HTTP_REFERER'], $allowed)) {
            header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_REFERER'] . "");
        } else {
            throw new Exception("Not accepted origin");
            return Response::respond403();
        }

        $fileName = Controller::request('file');
        $isStaffProfilePic = !Staff::getDataStore($fileName, 'profilePic')->isNull();

        $fileDownloader = FileDownloader::getInstance();
        $fileDownloader->setFileName($fileName);

        $session = Session::getInstance();

        $isStaffLogged = $session->isStaffLogged();

        if(!$isStaffLogged) {
            switch($fileDownloader->getFilePermission()) {
                case FileManager::PERMISSION_TICKET:
                    $ticketNumber = $fileDownloader->getTicketNumber();
                    $ticket = Ticket::getByTicketNumber($ticketNumber);
                    if($this->isNotAuthor($ticket, Controller::getLoggedUser())) {
                        return Response::respond403();
                    }
                    break;
                case FileManager::PERMISSION_ARTICLE:
                    if(!$session->sessionExists()) {
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
