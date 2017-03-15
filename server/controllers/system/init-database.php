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
            return;
        }

        $configFile = fopen('config.php', 'w+') or die(ERRORS::INVALID_FILE);
        $content = '<?php' . PHP_EOL;
        $content .= 'define(\'MYSQL_HOST\', \'' . Controller::request('dbHost') . '\');' . PHP_EOL;
        $content .= 'define(\'MYSQL_USER\', \'' . Controller::request('dbUser') . '\');' . PHP_EOL;
        $content .= 'define(\'MYSQL_PASSWORD\', \'' . Controller::request('dbPassword') . '\');' . PHP_EOL;
        $content .= 'define(\'MYSQL_DATABASE\', \'' . Controller::request('dbName') . '\');' . PHP_EOL;

        fwrite($configFile, $content);
        fclose($configFile);
        Response::respondSuccess();
    }
}