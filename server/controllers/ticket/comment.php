<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/comment Comment ticket
 * @apiVersion 4.6.1
 *
 * @apiName Comment ticket
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path comments a ticket.
 *
 * @apiPermission user
 *
 * @apiParam {String} content Content of the comment.
 * @apiParam {Number} ticketNumber The number of the ticket to comment.
 * @apiParam {Boolean} private Indicates if the comment is not shown to users.
 * @apiParam {Number} images The number of images in the content
 * @apiParam image_i The image file of index `i` (mutiple params accepted)
 * @apiParam file The file you with to upload.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_CONTENT
 * @apiUse INVALID_TICKET
 * @apiUse INVALID_TOKEN
 * @apiUse INVALID_FILE
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class CommentController extends Controller {
    const PATH = '/comment';
    const METHOD = 'POST';

    private $ticket;
    private $content;
    private $session;

    public function validations() {
        $this->session = Session::getInstance();

        if (Controller::isUserSystemEnabled() || Controller::isStaffLogged()) {
            return [
                'permission' => 'user',
                'requestData' => [
                    'content' => [
                        'validation' => DataValidator::content(),
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
                        'validation' => DataValidator::content(),
                        'error' => ERRORS::INVALID_CONTENT
                    ],
                    'ticketNumber' => [
                        'validation' => DataValidator::equals($this->session->getTicketNumber()),
                        'error' => ERRORS::INVALID_TICKET
                    ],
                    'csrf_token' => [
                        'validation' => DataValidator::equals($this->session->getToken()),
                        'error' => ERRORS::INVALID_TOKEN
                    ]
                ]
            ];
        }
    }

    public function handler() {
        $this->requestData();
        $ticketAuthor = $this->ticket->authorToArray();
        $isAuthor = $this->session->isTicketSession() || $this->ticket->isAuthor($this->user);
        $isOwner = $this->ticket->isOwner($this->user);
        $private = Controller::request('private');
        if(!Controller::isStaffLogged() && Controller::isUserSystemEnabled() && !$isAuthor){
            throw new RequestException(ERRORS::NO_PERMISSION);
        }
        
        if(!$this->session->isTicketSession() && !$this->user->canManageTicket($this->ticket)) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        $this->storeComment();

        if(!$isAuthor && !$private) {
            $this->sendMail($ticketAuthor);
        }
        if($this->ticket->owner && !$isOwner) {
            $this->sendMail([
                'email' => $this->ticket->owner->email,
                'name' => $this->ticket->owner->name,
                'staff' => true
            ]);
        }

        Log::createLog('COMMENT', $this->ticket->ticketNumber);

        Response::respondSuccess();
    }

    private function requestData() {
        $ticketNumber = Controller::request('ticketNumber');
        $this->ticket = Ticket::getByTicketNumber($ticketNumber);
        $this->content = Controller::request('content', true);
        $this->user = Controller::getLoggedUser();
    }

    private function storeComment() {
        $fileUploader = FileUploader::getInstance();
        $fileUploader->setPermission(FileManager::PERMISSION_TICKET, $this->ticket->ticketNumber);
        $imagePaths = $this->uploadImages(Controller::isStaffLogged());
        $fileUploader = $this->uploadFile(Controller::isStaffLogged());

        $comment = Ticketevent::getEvent(Ticketevent::COMMENT);
        $comment->setProperties(array(
            'content' => $this->replaceWithImagePaths($imagePaths, $this->content),
            'file' => ($fileUploader instanceof FileUploader) ? $fileUploader->getFileName() : null,
            'date' => Date::getCurrentDate(),
            'private' => (Controller::isStaffLogged() && Controller::request('private')) ? 1 : 0
        ));

        if(Controller::isStaffLogged()) {
            $this->ticket->unread = !$this->ticket->isAuthor($this->user);
            $this->ticket->unreadStaff = !$this->ticket->isOwner($this->user);
            $comment->authorStaff = $this->user;
        } else if(Controller::isUserSystemEnabled()) {
            $this->ticket->unreadStaff = true;
            $comment->authorUser = $this->user;
        } else {
            $this->ticket->unreadStaff = true;
        }

        $this->ticket->addEvent($comment);
        $this->ticket->store();
    }

    private function sendMail($recipient) {
        $mailSender = MailSender::getInstance();

        $email = $recipient['email'];
        $name = $recipient['name'];
        $isStaff = array_key_exists('staff', $recipient) && $recipient['staff'];

        $url = Setting::getSetting('url')->getValue();

        if(!Controller::isUserSystemEnabled() && !$isStaff) {
          $url .= '/check-ticket/' . $this->ticket->ticketNumber;
          $url .= '/' . $email;
        }

        $mailSender->setTemplate(MailTemplate::TICKET_RESPONDED, [
          'to' => $email,
          'name' => $name,
          'title' => $this->ticket->title,
          'ticketNumber' => $this->ticket->ticketNumber,
          'content' => $this->content,
          'url' => $url
        ]);

        $mailSender->send();
    }
}
