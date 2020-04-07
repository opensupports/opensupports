<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/enable-registration Enable registration
 * @apiVersion 4.6.1
 *
 * @apiName Enable registration 
 *
 * @apiGroup System
 *
 * @apiDescription This path enables the registration.
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

class EnableRegistrationController extends Controller {
    const PATH = '/enable-registration';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }

    public function handler() {
        $password = Controller::request('password');

        if(!Hashing::verifyPassword($password,Controller::getLoggedUser()->password)) {
            throw new RequestException(ERRORS::INVALID_PASSWORD);
            return;
        }

        $registrationRow = Setting::getSetting('registration');

        $registrationRow->value = true;
        $registrationRow->store();

        Response::respondSuccess();
    }
}