<?php
require_once 'config.php';
require_once 'vendor/autoload.php';

// REDBEAN CONFIGURATION
use RedBeanPHP\Facade as RedBean;
RedBean::setup('mysql:host='. $mysql_host .';dbname=' . $mysql_database, $mysql_user, $mysql_password);
RedBean::setAutoResolve(true);

// SLIM FRAMEWORK
\Slim\Slim::registerAutoLoader();
$app = new \Slim\Slim();

// LOAD LIBRARIES
include_once 'libs/Controller.php';
include_once 'libs/ControllerGroup.php';
include_once 'libs/Hashing.php';
include_once 'libs/MailSender.php';
include_once 'libs/Date.php';
include_once 'libs/DataStoreList.php';

// LOAD DATA
spl_autoload_register(function ($class) {
    $classPath = "data/{$class}.php";

    if(file_exists($classPath)) {
        include_once $classPath;
    }
});

// LOAD MODELS
spl_autoload_register(function ($class) {
    $classPath = "models/{$class}.php";

    if(file_exists($classPath)) {
        include_once $classPath;
    }
});

//Load custom validations
include_once 'libs/validations/dataStoreId.php';
include_once 'libs/validations/userEmail.php';

// LOAD CONTROLLERS
foreach (glob('controllers/*.php') as $controller) {
    include_once $controller;
}

$app->run();
