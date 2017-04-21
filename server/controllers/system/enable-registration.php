<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/enable-registration Enable the registration.
 *
 * @apiName Enable registration 
 *
 * @apiGroup system
 *
 * @apiDescription This path enable the registration.
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
            Response::respondError(ERRORS::INVALID_PASSWORD);
            return;
        }

        $registrationRow = Setting::getSetting('registration');

        $registrationRow->value = true;
        $registrationRow->store();

        Response::respondSuccess();
    }
}