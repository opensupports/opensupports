<?php
use Ifsnop\Mysqldump as IMysqldump;

/**
 * @api {post} /system/backup-database Do a backup of the database.
 *
 * @apiName Backup database
 *
 * @apiGroup system
 *
 * @apiDescription This path do a backup of the database.
 *
 * @apiPermission Staff level 3
 *
 * @apiUse NO_PERMISSION
 * 
 * @apiSuccess {File} file File of the backup
 *
 */

class BackupDatabaseController extends Controller {
    const PATH = '/backup-database';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }

    public function handler() {
        global $mysql_host;
        global $mysql_database;
        global $mysql_user;
        global $mysql_password;

        $fileDownloader = FileDownloader::getInstance();
        $fileDownloader->setFileName('backup.sql');

        $mysqlDump = new IMysqldump\Mysqldump('mysql:host='. $mysql_host .';dbname=' . $mysql_database, $mysql_user, $mysql_password);
        $mysqlDump->start($fileDownloader->getFullFilePath());

        if($fileDownloader->download()) {
            $fileDownloader->eraseFile();
        }
    }
}