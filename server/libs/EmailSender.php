<?php
class EmailSender {

    public static function validRegister($mail) {

        $newMail = new PHPMailer;

        $mail->From = "Admin@opensupports.com";

        $newMail->addAddress($mail);

        $newMail->Subject = "You Have Been register successfully";

        if(!$newMail->send())
        {
            echo "Mailer Error: " . $newMail->ErrorInfo;
        }
        else
        {
            echo "Message has been sent successfully";
        }
    }
}