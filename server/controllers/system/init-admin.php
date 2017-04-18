<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /system/init-admin Create the main administrator account.
 *
 * @apiName Init admin
 *
 * @apiGroup system
 *
 * @apiDescription This path create the main administrator account.
 *
 * @apiPermission any
 *
 * @apiParam {String} name Name of the administrator.
 *
 * @apiParam {string} email Email of the administrator.
 * 
 * @apiParam {string} password Password of the administrator.
 *
 * @apiError {String} message
 *
 * @apiSuccess {Object} data
 *
 */

class InitAdminController extends Controller {
    const PATH = '/init-admin';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::length(2, 55),
                    'error' => ERRORS::INVALID_NAME
                ],
                'email' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
                ],
                'password' => [
                    'validation' => DataValidator::length(5, 200),
                    'error' => ERRORS::INVALID_PASSWORD
                ],
            ]
        ];
    }

    public function handler() {
        if(!Staff::isTableEmpty()) {
            throw new Exception(ERRORS::INIT_SETTINGS_DONE);
        }

        $staff = new Staff();
        $staff->setProperties([
            'name' => Controller::request('name'),
            'email' => Controller::request('email'),
            'password' => Hashing::hashPassword(Controller::request('password')),
            'profilePic' => '',
            'level' => 3,
            'sharedDepartmentList' => Department::getAll(),
            'sharedTicketList' => []
        ]);
        
        foreach(Department::getAll() as $department) {
            $department->owners++;
            $department->store();
        }
        
        $staff->store();

        Response::respondSuccess();
    }
}