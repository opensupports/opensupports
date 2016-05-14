<?php
$env['MYSQL_SERVER']   = getenv('MYSQL_SERVER');
$env['MYSQL_USER']     = getenv('MYSQL_USER');
$env['MYSQL_PASSWORD'] = getenv('MYSQL_PASSWORD');
$env['MYSQL_DATABASE'] = getenv('MYSQL_DATABASE');

$mysql_host       = ($env['MYSQL_SERVER'])   ? $env['MYSQL_SERVER']   : 'localhost';
$mysql_user       = ($env['MYSQL_USER'])     ? $env['MYSQL_USER']     : 'root';
$mysql_password   = ($env['MYSQL_PASSWORD']) ? $env['MYSQL_PASSWORD'] : '';
$mysql_database   = ($env['MYSQL_DATABASE']) ? $env['MYSQL_DATABASE'] : 'development';
