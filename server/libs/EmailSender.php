<?php
class EmailSender {

    public function validRegister($mail) {

        $newMail = new PHPMailer;

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