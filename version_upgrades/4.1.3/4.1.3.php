<?php
require_once '../mysql_connect.php';
require_once 'libs/InitialMails.php';

// Unassign tickets whose owner doesn't service the department
$staffQueryResult = $mysql->query("SELECT id FROM staff");
while($staff = $staffQueryResult->fetch_array(MYSQLI_ASSOC)) {
  $departments = [];

  $departmentQueryResult = $mysql->query("SELECT department_id FROM department_staff WHERE staff_id='" . $staff['id'] . "'");
  while($department = $departmentQueryResult->fetch_array(MYSQLI_ASSOC)) $departments[] = $department['department_id'];

  function parse_department($departmentId) {
    return " AND (NOT department_id='$departmentId')";
  }

  $ticketQueryResult = $mysql->query(
    "SELECT id FROM ticket WHERE owner_id='" . $staff['id'] . "'" . array_map("parse_department", $departments) . ")"
  );

  while($ticket = $ticketQueryResult->fetch_array(MYSQLI_ASSOC)) {
    $mysql->query("UPDATE ticket SET owner_id=NULL WHERE id='" . $ticket['id'] . "'");
    $mysql->query("DELETE staff_ticket WHERE ticket_id='" . $ticket['id'] . "'");
  }
}

// Add new languages
$mysql->query("INSERT into langauge VALUES(NULL, 'br', '0', '0')");
$mysql->query("INSERT into langauge VALUES(NULL, 'gr', '0', '0')");
$mysql->query("INSERT into langauge VALUES(NULL, 'bl', '0', '0')");

// Repopulate mails
$mysql->query("DELETE FROM mailtemplate");
InitialMails::retrieve();

foreach ($mails as $mailType => $mailLanguages) {
    foreach ($mailLanguages as $mailLanguage => $mailContent) {
        $mailSubject = $mailContent['subject'];
        $mailBody = $mailContent['body'];
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
