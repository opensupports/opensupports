<?php
class MailSender {

    private $mailOptions = [];
    
    public function __construct() {
        $this->mailOptions['from'] = Setting::getSetting('no-reply-email')->value;
        $this->mailOptions['fromName'] = 'OpenSupports';

        $this->mailOptions['smtp-host'] = Setting::getSetting('smtp-host')->value;
        $this->mailOptions['smtp-port'] = Setting::getSetting('smtp-port')->value;
        $this->mailOptions['smtp-user'] = Setting::getSetting('smtp-user')->value;
        $this->mailOptions['smtp-pass'] = Setting::getSetting('smtp-pass')->value;
    }

    public function setTemplate($type, $config) {
        $mailTemplate = MailTemplate::getTemplate($type);
        $compiledMailContent = $mailTemplate->compile($config);
        
        $this->mailOptions = array_merge($this->mailOptions, $compiledMailContent);
    }
    
    public function send() {
        $mailer = new PHPMailer();

        $mailer->From = $this->mailOptions['from'];
        $mailer->FromName = $this->mailOptions['fromName'];
        $mailer->addAddress($this->mailOptions['to']);
        $mailer->Subject = $this->mailOptions['subject'];
        $mailer->Body = $this->mailOptions['body'];
        $mailer->isHTML(true);

        $mailer->isSMTP();
        $mailer->SMTPAuth = true;
        $mailer->Host = $this->mailOptions['smtp-host'];
        $mailer->Port = $this->mailOptions['smtp-port'];
        $mailer->Username = $this->mailOptions['smtp-user'];
        $mailer->Password = $this->mailOptions['smtp-pass'];
        $mailer->Timeout = 1000;
        $mailer->SMTPOptions  = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ];

        if ($mailer->smtpConnect()) {
            $mailer->send();
        }
    }
}