<?php
require_once '../mysql_connect.php';
use RedBeanPHP\Facade as RedBean;

print 'Begin update v4.7.0...' . PHP_EOL;

// Update User table


print '[1/4] Updating user table...' . PHP_EOL;


if ($mysql->query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'user' AND COLUMN_NAME = 'not_registered' AND TABLE_SCHEMA = '$mysql_db'")->num_rows == 0) {
    $mysql->query("ALTER TABLE user ADD not_registered tinyint(1)");
    $mysql->query("UPDATE user SET not_registered = null ");
} else {
    print '-not_registered column already exists' . PHP_EOL;
}

if(!Setting::getSetting('user-system-enabled')->isNull() && !Setting::getSetting('user-system-enabled')->getValue()) {
    $ticketList = Ticket::getAll();

    foreach($ticketList as $ticket) {
        if($ticket->authorStaff) {
            continue;
        }

        $userInstance = User::getDataStore($ticket->authorEmail, 'email');
        $ticketInstance = Ticket::getByTicketNumber($ticket->ticketNumber);

        if($userInstance->isNull()) {
            
            $userInstance = new User();

            $password = Hashing::generateRandomToken();

            $userInstance->setProperties([
                'name' => $ticket->authorName,
                'signupDate' => Date::getCurrentDate(),
                'tickets' => 0,
                'email' => $ticket->authorEmail,
                'password' => Hashing::hashPassword($password),
                'notRegistered' => 1,
                'verificationToken' => null
            ]);

            $userInstance->store();
        }
		
        $userInstance->tickets = $userInstance->tickets + 1;
        $userInstance->sharedTicketList->add($ticket);
        $userInstance->store();
        
        $ticketInstance->author = $userInstance;
        $ticketInstance->store();
    }
} else {
    print '-The tickets created already have owner Users' . PHP_EOL;
}

// Update mailtemplate table
print '[2/4] Updating mailtemplate table...' . PHP_EOL;
if ($mysql->query("SELECT * FROM mailtemplate WHERE template='USER_SYSTEM_DISABLED' ")->num_rows != 0) {
    $mysql->query("DELETE FROM mailtemplate WHERE template='USER_SYSTEM_DISABLED' ");
} else {
    print '-user_system_disabled template is already deleted' . PHP_EOL;
}

if ($mysql->query("SELECT * FROM mailtemplate WHERE template='USER_SYSTEM_ENABLED' ")->num_rows != 0) {
    $mysql->query("DELETE FROM mailtemplate WHERE template='USER_SYSTEM_ENABLED' ");
} else {
    print '-user_system_enabled template is already deleted' . PHP_EOL;
}

// Update Department table
print '[3/4] Updating department table...' . PHP_EOL;
if ($mysql->query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'department' AND COLUMN_NAME = 'private' AND TABLE_SCHEMA = '$mysql_db'")->num_rows == 0) {
    $mysql->query("ALTER TABLE department ADD private tinyint(1)");
    $mysql->query("UPDATE department SET private = 0 ");
} else {
    print 'private column already exists' . PHP_EOL;
}

// Update setting table
print '[4/4] Updating setting table...' . PHP_EOL;
if ($mysql->query("SELECT * FROM setting WHERE name='mandatory-login' ")->num_rows == 0) {
    $userSystemEnabled = $mysql->query("SELECT * FROM setting WHERE name='user-system-enabled'");
    if($userSystemEnabled->fetch_array(MYSQLI_ASSOC)['value']){
        $mysql->query("INSERT into setting VALUES(NULL, 'mandatory-login', '1')");
    }else{
        $mysql->query("INSERT into setting VALUES(NULL, 'mandatory-login', '0')");
        $mysql->query("UPDATE setting SET value=1 where name='registration'");
    }
} else {
    print '-Mandatory-login already exists' . PHP_EOL;
}
if ($mysql->query("SELECT * FROM setting WHERE name='default-department-id' ")->num_rows == 0) {
    $publicDepartment = $mysql->query("SELECT * FROM department WHERE private= 0 OR private IS NULL");
    if($publicDepartment->num_rows != 0){
        $query = "INSERT into setting VALUES(NULL, 'default-department-id', ". $publicDepartment->fetch_array(MYSQLI_BOTH)['id'] . " )";
		
        $mysql->query($query);
    }else{
        print '-Fail DEFAULT-DEPARTMENT-ID update. A public department is required';
    }
} else {
    print '-Default-department-id already exists' . PHP_EOL;
}

if ($mysql->query("SELECT * FROM setting WHERE name='default-is-locked' ")->num_rows == 0) {
    $mysql->query("INSERT into setting VALUES(NULL, 'default-is-locked', '0')");
} else {
    print '-Default-is-locked already exists' . PHP_EOL;
}

if ($mysql->query("SELECT * FROM setting WHERE name='user-system-enabled' ")->num_rows != 0) {
    $mysql->query("DELETE FROM setting WHERE name='user-system-enabled' ");
} else {
    print '-User-system-enabled is already deleted' . PHP_EOL;
}

print 'Update Completed!' . PHP_EOL;



