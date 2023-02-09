<?php
require_once '../mysql_connect.php';
use RedBeanPHP\Facade as RedBean;

print 'Begin update v4.6.0...' . PHP_EOL;

// Create Schema 
print '[1/4] Creating Tables...' . PHP_EOL;
RedBean::exec(file_get_contents('../../api/data/db_schema.sql'));

// Update Ticket table
print '[2/4] Updating ticket table...' . PHP_EOL;
if ($mysql->query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'ticket' AND COLUMN_NAME = 'edited_title' AND TABLE_SCHEMA = '$mysql_db'")->num_rows == 0) {
	$mysql->query("ALTER TABLE ticket ADD edited_title tinyint(1)");
} else {
	print 'edited_title column already exists' . PHP_EOL;
}

// Update APIkey table
print '[3/4] Updating APIkey table...' . PHP_EOL;
if ($mysql->query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'apikey' AND COLUMN_NAME = 'type' AND TABLE_SCHEMA = '$mysql_db'")->num_rows == 0) {
	$mysql->query("ALTER TABLE apikey ADD type varchar(191)");
} else {
	print 'type column already  exists' . PHP_EOL;
}

// Update Log table
print '[4/4] Updating Log table...' . PHP_EOL;
if ($mysql->query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'log' AND COLUMN_NAME = 'author_name' AND TABLE_SCHEMA = '$mysql_db'")->num_rows == 0) {
	$mysql->query("ALTER TABLE log ADD author_name varchar(191)");
} else {
	print 'author_name column already exists' . PHP_EOL;
}

print 'Update Completed!' . PHP_EOL;
