<?php
require_once '../mysql_connect.php';

$filePath = '../../api/files';

print 'Begin update v4.3.0...' . PHP_EOL;

// Change profile pics
print '[1/3] Updating profile pics..' . PHP_EOL;
$queryResult = $mysql->query("SELECT id,profile_pic FROM staff") or die(PHP_EOL . 'Error: profile_pic can\'t be found on `staff` table'. PHP_EOL);
while($staff = $queryResult->fetch_array(MYSQLI_ASSOC)) {
    global $filePath;
    $id = $staff['id'];
    $profilePicFileName = $staff['profile_pic'];
    $updatedProfilePicFileName = "p_$profilePicFileName";

    if(!$profilePicFileName || $profilePicFileName[0] == 'p') continue;

    rename("$filePath/$profilePicFileName", "$filePath/$updatedProfilePicFileName")
    or die("Error: could not change file name from $profilePicFileName to $updatedProfilePicFileName");

    $mysql->query("UPDATE staff SET profile_pic='$updatedProfilePicFileName' WHERE id='$id'")
    or die (PHP_EOL . "Error: could not update profile_pic for staff id:$id" . PHP_EOL);
}

// Change ticket attachments
print '[2/3] Updating ticket attachments...' . PHP_EOL;
function updateTicketFile($ticketNumber, $fileName) {
    global $filePath;
    $updatedFileName = "t$ticketNumber" . "_$fileName";

    rename("$filePath/$fileName", "$filePath/$updatedFileName")
    or die(PHP_EOL . "Error: could not change file name from $fileName to $updatedFileName" . PHP_EOL);

    return $updatedFileName;
}

$queryResult = $mysql->query("SELECT id,ticket_number,file FROM ticket");
while($queryResult && $ticket = $queryResult->fetch_array(MYSQLI_ASSOC)) {
    $id = $ticket['id'];

    if(!$ticket['file'] || $ticket['file'][0] == 't') continue;

    $updatedFileName = updateTicketFile($ticket['ticket_number'], $ticket['file']);

    $mysql->query("UPDATE ticket SET file='$updatedFileName' WHERE id='$id'")
    or die (PHP_EOL . "Error: could not update file for ticket id:$id" . PHP_EOL);
}

// Change ticket attachments
print '[3/3] Updating ticketevent attachments...' . PHP_EOL;
$queryResult = $mysql->query("SELECT id,ticket_id,file FROM ticketevent");
while($queryResult && $ticketEvent = $queryResult->fetch_array(MYSQLI_ASSOC)) {
    $id = $ticketEvent['id'];
    $ticketId = $ticketEvent['ticket_id'];
    $ticketQuery = $mysql->query("SELECT ticket_number FROM ticket WHERE id='$ticketId'") or die(PHP_EOL . "Error: could not find ticket id:$id" . PHP_EOL);
    $ticketNumber = $ticketQuery->fetch_array()[0];

    if(!$ticketEvent['file'] || $ticketEvent['file'][0] == 't') continue;

    $updatedFileName = updateTicketFile($ticketNumber, $ticketEvent['file']);

    $mysql->query("UPDATE ticketevent SET file='$updatedFileName' WHERE id='$id'")
    or die (PHP_EOL . "Error: could not update file for ticketevent id:$id" . PHP_EOL);
}

print 'Update Completed!' . PHP_EOL;
