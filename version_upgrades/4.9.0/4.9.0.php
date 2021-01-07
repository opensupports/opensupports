<?php
require_once '../mysql_connect.php';
use RedBeanPHP\Facade as RedBean;

print 'Begin update v4.9.0...' . PHP_EOL;

// Update apikey table
print '[1/1] Updating apikey table...'. PHP_EOL; 

if($mysql->query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'apikey' AND TABLE_SCHEMA = '$mysql_db'")->num_rows != 0){
    
    if($mysql->query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'apikey' AND COLUMN_NAME = 'can_create_users' AND TABLE_SCHEMA = '$mysql_db'")->num_rows == 0){
        $mysql->query("ALTER TABLE apikey ADD can_create_users tinyint(1)");
    }
    if($mysql->query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'apikey' AND COLUMN_NAME = 'can_create_tickets' AND TABLE_SCHEMA = '$mysql_db'")->num_rows == 0){
        $mysql->query("ALTER TABLE apikey ADD can_create_tickets tinyint(1)");
    }
    if($mysql->query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'apikey' AND COLUMN_NAME = 'should_return_ticket_number' AND TABLE_SCHEMA = '$mysql_db'")->num_rows == 0){
        $mysql->query("ALTER TABLE apikey ADD should_return_ticket_number tinyint(1)");
    }
    if($mysql->query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'apikey' AND COLUMN_NAME = 'can_check_tickets' AND TABLE_SCHEMA = '$mysql_db'")->num_rows == 0){
        $mysql->query("ALTER TABLE apikey ADD can_check_tickets tinyint(1)");
    
    }
    $mysql->query("UPDATE apikey SET can_create_users=1 where type='REGISTRATION'");
    $mysql->query("UPDATE apikey SET can_create_tickets=1 where type='TICKET_CREATE'");
    $mysql->query("UPDATE apikey SET should_return_ticket_number=1 where type='TICKET_CREATE'");
}else{
    print 'apikey table already updated'. PHP_EOL; 
}

print 'Update Completed!' . PHP_EOL;
