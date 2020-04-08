<?php

/**
 * @api {post} /system/disable-mandatory-login Disable mandatory Login
 * @apiVersion 4.6.1
 *
 * @apiName Disable Mandatory Login
 *
 * @apiGroup System
 *
 * @apiDescription This path disables the mandatory Login.
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

class DisableMandatoryLoginController extends Controller {
    const PATH = '/disable-mandatory-login';
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

        $mandatoryLoginRow->value = false;
        $mandatoryLoginRow->store();

        Response::respondSuccess();
    }
}