<?php
require_once '../mysql_connect.php';

require_once './libs/Hashing.php';
require_once './libs/LinearCongruentialGenerator.php';
require_once './libs/MailSender.php';

$ticketGap = Hashing::generateRandomPrime(1000000, 9999999);
$fileGap = Hashing::generateRandomPrime(1000000, 9999999);
$ticketFirstNumber = Hashing::generateRandomNumber(1000000, 9999999);
$fileFirstNumber = Hashing::generateRandomNumber(1000000, 9999999);

$mysql->query("UPDATE setting SET value='$ticketGap' WHERE name='ticket-gap'");
$mysql->query("UPDATE setting SET value='$fileGap' WHERE name='file-gap'");
$mysql->query("UPDATE setting SET value='$ticketFirstNumber' WHERE name='ticket-first-number'");
$mysql->query("UPDATE setting SET value='$fileFirstNumber' WHERE name='file-first-number'");

$smtpHost = $mysql->query("SELECT value FROM setting WHERE name='smtp-host'")->fetch_array(MYSQLI_ASSOC)['value'];
$smtpPort = $mysql->query("SELECT value FROM setting WHERE name='smtp-port'")->fetch_array(MYSQLI_ASSOC)['value'];
$smtpUser = $mysql->query("SELECT value FROM setting WHERE name='smtp-user'")->fetch_array(MYSQLI_ASSOC)['value'];
$smtpPassword = $mysql->query("SELECT value FROM setting WHERE name='smtp-pass'")->fetch_array(MYSQLI_ASSOC)['value'];
$noReplyEmail = $mysql->query("SELECT value FROM setting WHERE name='no-reply-email'")->fetch_array(MYSQLI_ASSOC)['value'];
$userSystemEnabled = $mysql->query("SELECT value FROM setting WHERE name='user-system-enabled'")->fetch_array(MYSQLI_ASSOC)['value'];
$url = $mysql->query("SELECT value FROM setting WHERE name='url'")->fetch_array(MYSQLI_ASSOC)['value'];

$mailSender = MailSender::getInstance();
$mailSender->setConnectionSettings(
    $smtpHost, $smtpPort, $smtpUser, $smtpPassword, $noReplyEmail
);

function compileString($string, $config) {
    $compiledString = $string;

    foreach ($config as $configName => $configValue) {
        $compiledString = str_replace("{{{$configName}}}", $configValue, $compiledString);
    }

    return $compiledString;
}

$migrationMail = file_get_contents('./libs/migration-mail.html');

if($tickets = $mysql->query("SELECT * FROM ticket ORDER BY id ASC")) {
    $linearCongruentialGenerator = new LinearCongruentialGenerator();
    $linearCongruentialGenerator->setGap($ticketGap);
    $linearCongruentialGenerator->setFirst($ticketFirstNumber);
    $offset = 0;
    $emails = [];

    while($ticket = $tickets->fetch_assoc()) {
        $ticketId = $ticket['id'];
        $ticketNumber = $linearCongruentialGenerator->generate($offset);

        $mysql->query("UPDATE ticket SET ticket_number='$ticketNumber' WHERE id='$ticketId'");

        if(array_key_exists('author_email', $ticket) && $ticket['author_email']) {
            if(!array_key_exists($ticket['author_email'], $emails)) {
                $emails[$ticket['author_email']] = [];
            }

            array_push(
                $emails[$ticket['author_email']],
                [
                    'old_number' => $ticket['ticket_number'],
                    'new_number' => $ticketNumber,
                    'title' => $ticket['title']
                ]
            );
        }

        $offset++;
    }

    foreach($emails as $email => $emailTickets) {
        $ticketString = '';

        foreach($emailTickets as $ticket) {
            $ticketString .= '<p>';
            $ticketString .= $ticket['old_number'];
            $ticketString .= ' => ';
            $ticketString .= $ticket['new_number'];
            $ticketString .= ' ';
            $ticketString .= htmlentities($ticket['title']);
            $ticketString .= '</p>';
            $ticketString .= PHP_EOL;
        }

        $mailSender->setMailContent([
            'to' => $email,
            'subject' => 'Tickets have been updated',
            'body' => compileString($migrationMail, [
                'url' => $url,
                'email' => $email,
                'tickets' => $ticketString,
            ])
        ]);

        $mailSender->send();
    }
}
