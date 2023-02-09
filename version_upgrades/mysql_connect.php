<?php
require_once '../../api/config.php';
require_once '../../api/vendor/autoload.php';

$mysql_host = MYSQL_HOST;
$mysql_port = defined('MYSQL_PORT') ? MYSQL_PORT : '3306';
$mysql_user = MYSQL_USER;
$mysql_password = MYSQL_PASSWORD;
$mysql_db = MYSQL_DATABASE;

$mysql = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_db, $mysql_port);

if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

use RedBeanPHP\Facade as RedBean;
RedBean::setup('mysql:host='. $mysql_host . ';port=' . $mysql_port . ';dbname=' . $mysql_db , $mysql_user, $mysql_password);
RedBean::setAutoResolve(true);
