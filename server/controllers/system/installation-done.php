<?php
use RedBeanPHP\Facade as RedBean;

/**
 * @api {post} /system/installation-done Installation done
 * @apiVersion 4.6.1
 *
 * @apiName Installation done
 *
 * @apiGroup System
 *
 * @apiDescription This path checks if the installation is already done.
 *
 * @apiPermission any
 *
 * @apiSuccess {Boolean} data Indicates if the installation is already done.
 *
 */

class InstallationDoneController extends Controller {
    const PATH = '/installation-done';
    const METHOD = 'POST';

    public static function isInstallationDone() {
        return RedBean::testConnection() && !Setting::isTableEmpty() && !Staff::isTableEmpty();
    }
    
    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        if(InstallationDoneController::isInstallationDone()) {
            Response::respondSuccess(1);
        } else {
            Response::respondSuccess(0);
        }
    }
}