<?php
class EmailSender {

    public static function validRegister($mail) {
        $newMail = new PHPMailer;

        $mail->From = "admin@opensupports.com";

        $newMail->addAddress($mail);

        $newMail->Subject = "You Have Been register successfully";

        if(!$newMail->send())
        {
            Response::respondError("Mailer Error: " . $newMail->ErrorInfo);
        }
        else
        {
            echo "Message has been sent successfully";
        }
    }
}