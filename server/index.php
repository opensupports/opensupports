<?php
@include 'config.php';
require_once 'vendor/autoload.php';

// REDBEAN CONFIGURATION
use RedBeanPHP\Facade as RedBean;

if(defined('MYSQL_HOST') && defined('MYSQL_DATABASE') && defined('MYSQL_USER') && defined('MYSQL_PASSWORD')) {
    if(!defined('MYSQL_PORT')) define('MYSQL_PORT', '3306');
    RedBean::setup('mysql:host='. MYSQL_HOST . ';port=' . MYSQL_PORT . ';dbname=' . MYSQL_DATABASE , MYSQL_USER, MYSQL_PASSWORD);
    RedBean::setAutoResolve(true);
}

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
include_once 'libs/LinearCongruentialGenerator.php';
include_once 'libs/FileManager.php';
include_once 'libs/FileDownloader.php';
include_once 'libs/FileUploader.php';

Controller::init();

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

// LOAD CUSTOM VALIDATIONS
include_once 'libs/validations/dataStoreId.php';
include_once 'libs/validations/userEmail.php';
include_once 'libs/validations/staffEmail.php';
include_once 'libs/validations/captcha.php';
include_once 'libs/validations/validLanguage.php';
include_once 'libs/validations/validTicketNumber.php';

// LOAD CONTROLLERS
foreach (glob('controllers/*.php') as $controller) {
    include_once $controller;
}

$app->run();
