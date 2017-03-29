<?php
use RedBeanPHP\Facade as RedBean;

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