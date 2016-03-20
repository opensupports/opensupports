<?php
require_once 'config.php';
require_once 'vendor/autoload.php';

// REDBEAN CONFIGURATION
use RedBeanPHP\Facade as RedBean;
RedBean::setup('mysql:host='. $mysql_host .';dbname=' . $mysql_database, $mysql_user, $mysql_password);

// SLIM FRAMEWORK
\Slim\Slim::registerAutoLoader();
$app = new \Slim\Slim();

// LOAD MODELS
spl_autoload_register(function ($class) {
    $classPath = "models/{$class}.php";

    if(file_exists($classPath)) {
        include $classPath;
    }
});

// LOAD CONTROLLERS
include_once 'libs/Controller.php';
include_once 'libs/ControllerGroup.php';

foreach (glob('controllers/*.php') as $controller) {
    include $controller;
}

$app->run();
