<?php

/**
 * @api {post} /system/disable-registration Disable registration
 * @apiVersion 4.11.0
 *
 * @apiName Disable registration
 *
 * @apiGroup System
 *
 * @apiDescription This path disables the registration.
 *
 * @apiPermission staff3
 *
 * @apiParam {String} password The password of the current staff.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PASSWORD
 * @apiUse MANDATORY_LOGIN_IS_DESACTIVATED
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class DisableRegistrationController extends Controller {
    const PATH = '/disable-registration';
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
        if(!Setting::getSetting('mandatory-login')->getValue()) { 
            throw new Exception(ERRORS::MANDATORY_LOGIN_IS_DESACTIVATED);
        }
        $registrationRow = Setting::getSetting('registration');

        $registrationRow->value = false;
        $registrationRow->store();

        Response::respondSuccess();
    }
}