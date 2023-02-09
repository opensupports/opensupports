<?php
require_once '../mysql_connect.php';

// User email to lowercase
$userQueryResult = $mysql->query("SELECT id,email FROM user");
while($user = $userQueryResult->fetch_array(MYSQLI_ASSOC)) {
    $id = $user['id'];
    $parsedEmail = strtolower($user['email']);
    $mysql->query("UPDATE user set email='$parsedEmail' WHERE id='$id'");
}

// Staff email to lowercase
$staffQueryResult = $mysql->query("SELECT id,email FROM staff");
while($staff = $staffQueryResult->fetch_array(MYSQLI_ASSOC)) {
    $id = $staff['id'];
    $parsedEmail = strtolower($staff['email']);
    $mysql->query("UPDATE staff set email='$parsedEmail' WHERE id='$id'");
}

// Ticeket email to lowercase
$ticketQueryResult = $mysql->query("SELECT id,author_email FROM ticket");
while($ticket = $ticketQueryResult->fetch_array(MYSQLI_ASSOC)) {
    if($ticket['author_email']) {
        $id = $ticket['id'];
        $parsedEmail = strtolower($ticket['author_email']);
        $mysql->query("UPDATE ticket set author_email='$parsedEmail' WHERE id='$id'");
    }
}
