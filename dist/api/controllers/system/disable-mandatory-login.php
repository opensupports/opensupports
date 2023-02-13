<?php

/**
 * @api {post} /system/disable-mandatory-login Disable mandatory Login
 * @apiVersion 4.11.0
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
 * @apiUse REGISTRATION_IS_DESACTIVATED
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
       
        if(!Setting::getSetting('registration')->getValue()) { 
            throw new Exception(ERRORS::REGISTRATION_IS_DESACTIVATED);
        }
        
        if(!Hashing::verifyPassword($password, Controller::getLoggedUser()->password)) {
            throw new RequestException(ERRORS::INVALID_PASSWORD);
        }
        
        $mandatoryLoginRow = Setting::getSetting('mandatory-login');

        $mandatoryLoginRow->value = 0;
        $mandatoryLoginRow->store();

        Response::respondSuccess();
    }
}