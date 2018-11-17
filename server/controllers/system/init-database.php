<?php
use RedBeanPHP\Facade as RedBean;

/**
 * @api {post} /system/init-database Init database
 * @apiVersion 4.3.0
 *
 * @apiName Init database
 *
 * @apiGroup System
 *
 * @apiDescription This path sets the database settings. It can only be used once during installation.
 *
 * @apiPermission any
 *
 * @apiParam {String} dbHost Location of the database server.
 * @apiParam {String} dbPort Port of the database server.
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
        Response::respondError(ERRORS::NO_PERMISSION);
    }
}
