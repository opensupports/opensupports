<?php
require_once '../../api/vendor/autoload.php';

class MailSender {

    private $mailOptions = [];
    private $mailerInstance;
    private static $instance = NULL;

    public static function getInstance() {
        if(MailSender::$instance === NULL) {
            MailSender::$instance = new MailSender();
        }

        return MailSender::$instance;
    }

    private function __construct() {}

    public function setConnectionSettings($host, $port, $user, $pass, $noReplyEmail) {
        $this->mailOptions['from'] = $noReplyEmail;
        $this->mailOptions['fromName'] = 'OpenSupports';

        $this->mailOptions['smtp-host'] = $host;
        $this->mailOptions['smtp-port'] = $port;
        $this->mailOptions['smtp-user'] = $user;
        $this->mailOptions['smtp-pass'] = $pass;
    }

    public function setMailContent($mailContent) {
        $this->mailOptions = array_merge($this->mailOptions, $mailContent);
    }

    public function send() {
        $mailerInstance = $this->getMailerInstance();

        if( !array_key_exists('to', $this->mailOptions) ||
            !array_key_exists('subject', $this->mailOptions) ||
            !array_key_exists('body', $this->mailOptions) ) {
            throw new Exception('Mail sending data not available');
        }

        $mailerInstance->ClearAllRecipients();
        $mailerInstance->addAddress($this->mailOptions['to']);
        $mailerInstance->Subject = $this->mailOptions['subject'];
        $mailerInstance->Body = $this->mailOptions['body'];
        $mailerInstance->isHTML(true);

        if ($this->isConnected()) {
            $mailerInstance->send();
        }
    }

    public function isConnected() {
        return $this->getMailerInstance()->smtpConnect();
    }

    private function getMailerInstance() {
        if(!($this->mailerInstance instanceof PHPMailer)) {
            $this->mailerInstance = new PHPMailer();

            $this->mailerInstance->From = $this->mailOptions['from'];
            $this->mailerInstance->FromName = $this->mailOptions['fromName'];

            $this->mailerInstance->isSMTP();
            $this->mailerInstance->SMTPAuth = true;
            $this->mailerInstance->Host = $this->mailOptions['smtp-host'];
            $this->mailerInstance->Port = $this->mailOptions['smtp-port'];
            $this->mailerInstance->Username = $this->mailOptions['smtp-user'];
            $this->mailerInstance->Password = $this->mailOptions['smtp-pass'];
            $this->mailerInstance->Timeout = 1000;
            $this->mailerInstance->SMTPOptions = [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                ]
            ];
        }

        return $this->mailerInstance;
    }
}
