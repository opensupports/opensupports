<?php

/**
 * @api {post} /system/enable-mandatory-login Enable mandatory Login
 * @apiVersion 4.11.0
 *
 * @apiName Enable Mandatory Login
 *
 * @apiGroup System
 *
 * @apiDescription This path enable the mandatory Login.
 *
 * @apiPermission staff3
 *
 * @apiParam {String} password The password of the current staff.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PASSWORD
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class EnableMandatoryLoginController extends Controller {
    const PATH = '/enable-mandatory-login';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }
    
    public function handler() {
        $password = Controller::request('password');

        if(!Hashing::verifyPassword($password, Controller::getLoggedUser()->password)) {
            throw new RequestException(ERRORS::INVALID_PASSWORD);
            return;
        }
        
        $mandatoryLoginRow = Setting::getSetting('mandatory-login');

        $mandatoryLoginRow->value = 1;
        $mandatoryLoginRow->store();

        Response::respondSuccess();
    }
}