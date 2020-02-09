<?php
require_once '../mysql_connect.php';
print 'Begin update v4.5.0...' . PHP_EOL;

// Update Languages
print '[1/1] Updating languages table...' . PHP_EOL;
if ($mysql->query("SELECT * FROM language WHERE code='pl' ")->num_rows == 0) {
	$mysql->query("INSERT into language VALUES(NULL, 'pl', '0', '0')");
} else {
	print 'Polish language already exists' . PHP_EOL;
}

print 'Update Completed!' . PHP_EOL;

