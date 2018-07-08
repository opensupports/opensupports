<?php
require_once '../mysql_connect.php';
require_once 'libs/InitialMails.php';

// Unassign tickets whose owner doesn't service the department
function parse_department($carry, $departmentId) {
  return $carry ." AND (NOT department_id='$departmentId')";
}

$staffQueryResult = $mysql->query("SELECT id FROM staff");
while($staff = $staffQueryResult->fetch_array(MYSQLI_ASSOC)) {
  $staffId = $staff['id'];
  $departments = [];

  $departmentQueryResult = $mysql->query("SELECT department_id FROM department_staff WHERE staff_id='$staffId'");
  while($department = $departmentQueryResult->fetch_array(MYSQLI_ASSOC)) $departments[] = $department['department_id'];

  $ticketQueryResult = $mysql->query(
    "SELECT id FROM ticket WHERE owner_id='$staffId'" . array_reduce($departments, "parse_department", "")
  );

  while($ticketQueryResult && $ticket = $ticketQueryResult->fetch_array(MYSQLI_ASSOC)) {
    $ticketId = $ticket['id'];
    $currentDate = date('YmdHi');

    $mysql->query("UPDATE ticket SET owner_id=NULL WHERE id='$ticketId'");
    $mysql->query("DELETE from staff_ticket WHERE ticket_id='$ticketId'");
    $mysql->query("INSERT into ticketevent VALUES(NULL, 'UN_ASSIGN', $currentDate, $ticketId, $staffId, NULL)");
  }
}

// Add new languages
$mysql->query("INSERT into language VALUES(NULL, 'br', '0', '0')");
$mysql->query("INSERT into language VALUES(NULL, 'gr', '0', '0')");
$mysql->query("INSERT into language VALUES(NULL, 'nl', '0', '0')");


// Repopulate mails
$mysql->query("DELETE FROM mailtemplate");
$mails = InitialMails::retrieve();

foreach ($mails as $mailType => $mailLanguages) {
    foreach ($mailLanguages as $mailLanguage => $mailContent) {
        $mailSubject = $mailContent['subject'];
        $mailBody = $mysql->real_escape_string($mailContent['body']);
        $mysql->query(
          "INSERT into mailtemplate (id, type, subject, language, body) VALUES " .
          "(NULL, '$mailType', '$mailSubject', '$mailLanguage' , '$mailBody')"
        );
    }
}

// CREATE MYSQL_PORT field
$configFile = fopen('../../api/config.php', 'w+') or die('Unable to open config.php');
$content = '<?php' . PHP_EOL;
$content .= 'define(\'MYSQL_HOST\', \'' . MYSQL_HOST . '\');' . PHP_EOL;
$content .= 'define(\'MYSQL_PORT\', \'' . 3306 . '\');' . PHP_EOL;
$content .= 'define(\'MYSQL_USER\', \'' . MYSQL_USER . '\');' . PHP_EOL;
$content .= 'define(\'MYSQL_PASSWORD\', \'' . MYSQL_PASSWORD . '\');' . PHP_EOL;
$content .= 'define(\'MYSQL_DATABASE\', \'' . MYSQL_DATABASE . '\');' . PHP_EOL;


fwrite($configFile, $content);
fclose($configFile);
