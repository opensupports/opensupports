<?php
//include '../../config.php';
use RedBeanPHP\Facade as RedBean;

class InitDatabaseController extends Controller {
    const PATH = '/init-database';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        if(defined('MYSQL_HOST')) {
            throw new Exception(ERRORS::INIT_SETTINGS_DONE);
        }

        $dbHost = Controller::request('dbHost');
        $dbName = Controller::request('dbName');
        $dbUser = Controller::request('dbUser');
        $dbPass = Controller::request('dbPassword');

        if(!defined('MYSQL_HOST')) {
            RedBean::setup('mysql:host=' . $dbHost, $dbUser, $dbPass);
        }

        if($dbName) {
            RedBean::addDatabase($dbName, 'mysql:host='. $dbHost . ';dbname=' . $dbName, $dbUser, $dbPass);
            RedBean::selectDatabase($dbName);

            if(!RedBean::testConnection()) {
                throw new Exception(ERRORS::DATABASE_CONNECTION);
            }
        } else {
            $dbName = 'opensupports_' . Hashing::generateRandomNumber(100, 999);
            RedBean::exec('CREATE DATABASE ' . $dbName);
            RedBean::addDatabase($dbName, 'mysql:host='. $dbHost . ';dbname=' . $dbName, $dbUser, $dbPass);
            RedBean::selectDatabase($dbName);

            if(!RedBean::testConnection()) {
                throw new Exception(ERRORS::DATABASE_CREATION);
            }
        }

        $configFile = fopen('config.php', 'w+') or die(ERRORS::INVALID_FILE);
        $content = '<?php' . PHP_EOL;
        $content .= 'define(\'MYSQL_HOST\', \'' . $dbHost . '\');' . PHP_EOL;
        $content .= 'define(\'MYSQL_USER\', \'' . $dbUser . '\');' . PHP_EOL;
        $content .= 'define(\'MYSQL_PASSWORD\', \'' . $dbPass . '\');' . PHP_EOL;
        $content .= 'define(\'MYSQL_DATABASE\', \'' . $dbName . '\');' . PHP_EOL;

        fwrite($configFile, $content);
        fclose($configFile);
        Response::respondSuccess();
    }
}