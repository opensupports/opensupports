<?php
class MailSender {

    private $mailOptions = [];
    
    //TODO: Add real initial options when Settings class is available
    public function __construct() {
        $this->mailOptions['from'] = 'noreply@opensupports.com';
        
        //SMTP Options
        $this->mailOptions['smtp_host'] = 'localhost';
        $this->mailOptions['smtp_port'] = 7070;
        $this->mailOptions['smtp_user'] = '';
        $this->mailOptions['smtp_pass'] = '';
    }

    public function setTemplate($type, $config) {
        $mailTemplate = MailTemplate::getTemplate($type);
        $compiledMailContent = $mailTemplate->compile($config);
        
        $this->mailOptions = array_merge($this->mailOptions, $compiledMailContent);
    }

    public function send() {
        $mailer = new PHPMailer();

        $mailer->From = $this->mailOptions['from'];
        $mailer->addAddress($this->mailOptions['to']);
        $mailer->Subject = $this->mailOptions['subject'];
        $mailer->Body = $this->mailOptions['body'];

        //$mailer->SMTPDebug = 3;
        $mailer->isSMTP();
        $mailer->SMTPAuth = true;
        $mailer->Host = $this->mailOptions['smtp_host'];
        $mailer->Port = $this->mailOptions['smtp_port'];
        $mailer->Username = $this->mailOptions['smtp_user'];
        $mailer->Password = $this->mailOptions['smtp_pass'];
        //$mailer->SMTPSecure = "tls";
        $mailer->Timeout = 1000;

        if ($mailer->smtpConnect()) {
            $mailer->send();
        }
    }
}