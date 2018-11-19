<?php
header('Access-Control-Allow-Origin: *');
require_once 'vendor/autoload.php';
require_once 'version.php';

// SLIM FRAMEWORK
\Slim\Slim::registerAutoLoader();
$app = new \Slim\Slim();

// LOAD CONTROLLERS
foreach (glob('controllers/*.php') as $controller) {
    include_once $controller;
}

Controller::init();

if(Controller::isProductionEnv()) {
    require_once 'mysql_client_connect.php';
} else {
    require_once 'config.php';
}

// REDBEAN CONFIGURATION
use RedBeanPHP\Facade as RedBean;

if(Controller::isProductionEnv() && !$client->getClientVersion()) {
    echo 'Client does not exist';
    exit;
}

if($client->getClientVersion() !== API_VERSION) {
    echo 'Invalid api version';
    exit;
}

if(defined('MYSQL_HOST') && defined('MYSQL_DATABASE') && defined('MYSQL_USER') && defined('MYSQL_PASSWORD')) {
    if(!defined('MYSQL_PORT')) define('MYSQL_PORT', '3306');
    RedBean::setup('mysql:host='. MYSQL_HOST . ';port=' . MYSQL_PORT . ';dbname=' . MYSQL_DATABASE , MYSQL_USER, MYSQL_PASSWORD);
    RedBean::setAutoResolve(true);
}

$app->run();
