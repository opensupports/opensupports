<?php
use Ifsnop\Mysqldump as IMysqldump;

/**
 * @api {post} /system/backup-database Backup database
 * @apiVersion 4.6.1
 *
 * @apiName Backup database
 *
 * @apiGroup System
 *
 * @apiDescription This path does a backup of the database.
 *
 * @apiPermission staff3
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
        $fileDownloader = FileDownloader::getInstance();
        $fileDownloader->setFileName('backup.sql');

        $mysqlDump = new IMysqldump\Mysqldump('mysql:host='. MYSQL_HOST . ';port=' . MYSQL_PORT . ';dbname=' . MYSQL_DATABASE , MYSQL_USER, MYSQL_PASSWORD);
        $mysqlDump->start($fileDownloader->getFullFilePath());

        if($fileDownloader->download()) {
            $fileDownloader->eraseFile();
        }
    }
}
