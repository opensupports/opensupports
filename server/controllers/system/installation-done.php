<?php
use RedBeanPHP\Facade as RedBean;

class InstallationDoneController extends Controller {
    const PATH = '/installation-done';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        if(RedBean::testConnection() && !Setting::isTableEmpty() && !Staff::isTableEmpty()) {
            Response::respondSuccess(1);
        } else {
            Response::respondSuccess(0);
        }
    }
}