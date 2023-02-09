<?php
class MailSender {
    use SingletonTrait;

    public $mailOptions = [];
    private $mailerInstance;

    private function __construct() {
        $this->setConnectionSettings(
            Setting::getSetting('smtp-host')->getValue(),
            Setting::getSetting('smtp-user')->getValue(),
            Setting::getSetting('smtp-pass')->getValue(),
            Setting::getSetting('server-email')->getValue()
        );
    }

    public function setConnectionSettings($host, $user, $pass, $serverEmail) {
        $this->mailOptions['from'] = $serverEmail;
        $this->mailOptions['fromName'] = 'OpenSupports';

        $this->mailOptions['smtp-host'] = $host;
        $this->mailOptions['smtp-user'] = $user;
        $this->mailOptions['smtp-pass'] = $pass;
    }

    public function setTemplate($type, $config) {
        $mailTemplate = MailTemplate::getMailTemplate($type);

        $this->mailOptions = array_merge($this->mailOptions, [
            'subject' => $mailTemplate->getSubject($config),
            'body' => $mailTemplate->getBody($config),
            'to' => $config['to'],
        ]);
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
            $this->mailerInstance->CharSet = 'UTF-8';

            $this->mailerInstance->isSMTP();
            $this->mailerInstance->Host = $this->mailOptions['smtp-host'];
            if($this->mailOptions['smtp-user'] !== '') {
                $this->mailerInstance->SMTPAuth = true;
                $this->mailerInstance->Username = $this->mailOptions['smtp-user'];
                $this->mailerInstance->Password = $this->mailOptions['smtp-pass'];
            }
            $this->mailerInstance->Timeout = 10;
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
