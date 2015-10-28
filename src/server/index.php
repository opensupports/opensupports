<?php
require_once 'api/config.php';
require_once 'vendor/autoload.php';

use RedBeanPHP\Facade as RedBean;

RedBean::setup('mysql:host='. $mysql_host .';dbname=' . $mysql_database, $mysql_user, $mysql_password);
$app = new \Slim\Slim();

include_once 'api/index.php';
