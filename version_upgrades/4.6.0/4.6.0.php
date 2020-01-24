<?php
require_once '../mysql_connect.php';
print 'Begin update v4.6.0...' . PHP_EOL;

// Update Ticket table
print '[1/3] Updating ticket table...' . PHP_EOL;
if ($mysql->query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'ticket' AND COLUMN_NAME = 'edited_title' AND TABLE_SCHEMA = '$mysql_db'")->num_rows == 0) {
	$mysql->query("ALTER TABLE ticket ADD edited_title tinyint(1)");
} else {
	print 'edited_title column already exists' . PHP_EOL;
}

// Update APIkey table
print '[2/3] Updating APIkey table...' . PHP_EOL;
if ($mysql->query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'apikey' AND COLUMN_NAME = 'type' AND TABLE_SCHEMA = '$mysql_db'")->num_rows == 0) {
	$mysql->query("ALTER TABLE apikey ADD type varchar(191)");
} else {
	print 'type column already  exists' . PHP_EOL;
}

// Update Log table
print '[3/3] Updating Log table...' . PHP_EOL;
if ($mysql->query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'log' AND COLUMN_NAME = 'author_name' AND TABLE_SCHEMA = '$mysql_db'")->num_rows == 0) {
	$mysql->query("ALTER TABLE log ADD author_name varchar(191)");
} else {
	print 'author_name column already exists' . PHP_EOL;
}

print 'Update Completed!' . PHP_EOL;
