<?php
$env['MYSQL_HOST']     = getenv('MYSQL_HOST');
$env['MYSQL_PORT']     = getenv('MYSQL_PORT');
$env['MYSQL_USER']     = getenv('MYSQL_USER');
$env['MYSQL_PASSWORD'] = getenv('MYSQL_PASSWORD');
$env['MYSQL_DATABASE'] = getenv('MYSQL_DATABASE');

$mysql_host       = ($env['MYSQL_HOST'])     ? $env['MYSQL_HOST']     : 'localhost';
$mysql_port       = ($env['MYSQL_PORT'])     ? $env['MYSQL_PORT']     : '3306';
$mysql_user       = ($env['MYSQL_USER'])     ? $env['MYSQL_USER']     : 'root';
$mysql_password   = ($env['MYSQL_PASSWORD']) ? $env['MYSQL_PASSWORD'] : '';
$mysql_database   = ($env['MYSQL_DATABASE']) ? $env['MYSQL_DATABASE'] : 'development';

define('MYSQL_HOST', $mysql_host);
define('MYSQL_PORT', $mysql_port);
define('MYSQL_USER', $mysql_user);
define('MYSQL_PASSWORD', $mysql_password);
define('MYSQL_DATABASE', $mysql_database);
