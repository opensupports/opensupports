<?php
//include '../../config.php';
use RedBeanPHP\Facade as RedBean;

/**
 * @api {post} /system/init-database Init database
 * @apiVersion 4.1.0
 *
 * @apiName Init database
 *
 * @apiGroup System
 *
 * @apiDescription This path sets the database settings. It can only be used once during installation.
 *
 * @apiPermission any
 *
 * @apiParam {String} dbHost Url of the database server.
 * @apiParam {String} dbName Name of the database. If not given, the system will try to create one.
 * @apiParam {String} dbUser User of the database server.
 * @apiParam {String} dbPassword Password of the database server.
 *
 * @apiUse DATABASE_CONNECTION
 * @apiUse DATABASE_CREATION
 * @apiUse INVALID_FILE
 *
 * @apiSuccess {Object} data Empty object
 *
 */

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