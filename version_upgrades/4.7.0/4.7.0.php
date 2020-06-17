<?php
require_once '../mysql_connect.php';
use RedBeanPHP\Facade as RedBean;

print 'Begin update v4.7.0...' . PHP_EOL;

// Update User table
print '[1/3] Updating user table...' . PHP_EOL;
if ($mysql->query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'user' AND COLUMN_NAME = 'not_registered' AND TABLE_SCHEMA = '$mysql_db'")->num_rows == 0) {
    $mysql->query("ALTER TABLE user ADD not_registered tinyint(1)");
    $mysql->query("UPDATE setting SET not_registered = false ");
} else {
    print '-not_registered column already exists' . PHP_EOL;
}

// Update mailtemplate table
print '[2/3] Updating mailtemplate table...' . PHP_EOL;
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

// Update setting table
print '[3/3] Updating setting table...' . PHP_EOL;
if ($mysql->query("SELECT * FROM setting WHERE name='mandatory-login' ")->num_rows == 0) {
    $userSystemEnabled = $mysql->query("SELECT * FROM setting WHERE name='user-system-enabled'");
    if($userSystemEnabled->fetch_array(MYSQLI_ASSOC)['value']){
        $mysql->query("INSERT into setting VALUES(NULL, 'mandatory-login', '1')");
    }else{
        $mysql->query("INSERT into setting VALUES(NULL, 'mandatory-login', '0')");
    }
} else {
    print '-Mandatory-login already exists' . PHP_EOL;
}

if ($mysql->query("SELECT * FROM setting WHERE name='default-department-id' ")->num_rows == 0) {
    $publicDepartment = $mysql->query("SELECT * FROM department WHERE private= false");
    if($publicDepartment->num_rows != 0){
        $query = "INSERT into setting VALUES(NULL, 'default-department-id', ". $publicDepartment->fetch_array(MYSQLI_ASSOC)['value'] . " )";
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
    print '-User-system-enabled is realready deleted' . PHP_EOL;
}

print 'Update Completed!' . PHP_EOL;