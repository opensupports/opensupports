<?php

class EmailPolling extends Controller {
    const PATH = '/email-polling';
    const METHOD = 'POST';

    private $mailbox;

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        $commentController = new CommentController();
        $createController = new CreateController();
        $defaultLanguage = Setting::getSetting('language')->getValue();
        $defaultDepartmentId = Department::getAll()->first()->id;

        if(Controller::isUserSystemEnabled())
            throw new RequestException(ERRORS::USER_SYSTEM);

        $this->mailbox = new \PhpImap\Mailbox(
            Setting::getSetting('imap-host')->getValue(),
            Setting::getSetting('imap-user')->getValue(),
            Setting::getSetting('imap-pass')->getValue(),
            __DIR__
        );

        $errors = [];
        $emails = $this->getLastEmails();

        $session = Session::getInstance();
        $oldSession = [
            'userId' => $session->getUserId(),
            'staff' => $session->getToken(),
            'token' => $session->isStaffLogged(),
        ];

        foreach($emails as $email) {
            Controller::setDataRequester(function ($key) use ($email, $defaultDepartmentId, $defaultLanguage) {
                switch ($key) {
                    case 'ticketNumber':
                        return $email->getTicketNumber();
                    case 'title':
                        return $email->getSubject();
                    case 'content':
                        return $email->getContent();
                    case 'departmentId':
                        return $defaultDepartmentId;
                    case 'language':
                        return $defaultLanguage;
                    case 'email':
                        return $email->getSender();
                    case 'name':
                        return $email->getSenderName();
                }

                return null;
            });

            try {
                if($email->isReply()) {
                    if($email->getTicket()->authorToArray()['email'] === $email->getSender()) {
                        $session->clearSessionData();
                        $session->createTicketSession($email->getTicket()->ticketNumber);

                        $commentController->handler();
                    }
                } else {
                    $createController->handler();
                }
            } catch(\Exception $e) {
                $errors[] = [
                    'author' => $email->getSender(),
                    'ticketNumber' => $email->getTicketNumber(),
                    'error' => $e->__toString(),
                ];
            }
        }

        $session->clearSessionData();
        $session->setSessionData($oldSession);

        $this->eraseAllEmails();

        if(count($errors)) {
            Response::respondError(ERRORS::EMAIL_POLLING, null, $errors);
        } else {
            Response::respondSuccess();
        }
    }

    public function getLastEmails() {
        $mailsIds = $this->mailbox->searchMailbox('ALL');
        $emails = [];
        sort($mailsIds);

        foreach($mailsIds as $mailId) {
            $mail = $this->mailbox->getMail($mailId);
            $mailHeader = $this->mailbox->getMailHeader($mailId);
            $emails[] = new Email([
                'fromAddress' => $mailHeader->fromAddress,
                'fromName' => $mailHeader->fromName,
                'subject' => $mailHeader->subject,
                'content' => $mail->textPlain,
                'file' => null,
            ]);
        }

        return $emails;
    }

    public function eraseAllEmails() {
        $mailsIds = $this->mailbox->searchMailbox('ALL');

        foreach($mailsIds as $mailId) {
            $this->mailbox->deleteMail($mailId);
        }

        $this->mailbox->expungeDeletedMails();
    }
}
