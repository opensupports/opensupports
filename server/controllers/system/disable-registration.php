<?php

/**
 * @api {post} /system/disable-registration Disable the registration.
 *
 * @apiName Disable registration
 *
 * @apiGroup system
 *
 * @apiDescription This path disable the registration.
 *
 * @apiPermission Staff level 3
 *
 * @apiParam {String} password The password of the current staff.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PASSWORD
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
            Response::respondError(ERRORS::INVALID_PASSWORD);
            return;
        }

        $registrationRow = Setting::getSetting('registration');

        $registrationRow->value = false;
        $registrationRow->store();

        Response::respondSuccess();
    }
}