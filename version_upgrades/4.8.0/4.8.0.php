<?php
require_once '../mysql_connect.php';
use RedBeanPHP\Facade as RedBean;

print 'Begin update v4.8.0...' . PHP_EOL;

// Update ticket table
print '[1/3] Updating ticket table...'. PHP_EOL; 
if($mysql->query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'ticket' AND COLUMN_NAME = 'priority' AND TABLE_SCHEMA = '$mysql_db'")->num_rows != 0){
    
    $tagHigh = new Tag();
    $tagHigh->setProperties([
        'name' => 'High',
        'color' => '#eb144c'
    ]);
    $tagHigh->store();

    $tagMedium = new Tag();
    $tagMedium->setProperties([
        'name' => 'Medium',
        'color' => '#0693e3'
    ]);
    $tagMedium->store();

    $tagLow = new Tag();
    $tagLow->setProperties([
        'name' => 'Low',
        'color' => '#00d084'
    ]);
    $tagLow->store();
    
    $ticketList = Ticket::getAll();
    foreach($ticketList as $ticket) {
        if($ticket->priority == "low") {
            $ticket->sharedTagList->add($tagLow);
        }
        if($ticket->priority == "medium") {
            $ticket->sharedTagList->add($tagMedium);
        }
        if($ticket->priority == "high") {
            $ticket->sharedTagList->add($tagHigh);
        }
        $ticket->store();
    }

    $mysql->query("ALTER TABLE ticket DROP priority");
} else {
    print 'priority column already deleted' . PHP_EOL;
}

// Update user table

print '[2/3] Updating user table...'. PHP_EOL; 
if($mysql->query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'user' AND COLUMN_NAME = 'supervisedrelation_id' AND TABLE_SCHEMA = '$mysql_db'")->num_rows == 0){
    $mysql->query("ALTER TABLE user ADD supervisedrelation_id int(11) UNSIGNED DEFAULT NULL");
} else {
    print 'supervisedrelation column already created' . PHP_EOL;
}

// Update supervisedrelation table

print '[3/3] Creating supervisedrelation table...'. PHP_EOL;
$mysql->query("CREATE TABLE IF NOT EXISTS supervisedrelation (
  `id` int(11) unsigned NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;");

print 'Update Completed!' . PHP_EOL;
