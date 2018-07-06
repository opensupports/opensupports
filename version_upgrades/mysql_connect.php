<?php
require_once '../api/config.php';

$mysql_host = MYSQL_HOST;
$mysql_port = defined('MYSQL_PORT') ? MYSQL_PORT : '3306';
$mysql_user = MYSQL_USER;
$mysql_password = MYSQL_PASSWORD;
$mysql_db = MYSQL_DB;

$mysql = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_db, $mysql_port);

if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}
