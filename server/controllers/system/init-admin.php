<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /system/init-admin Init admin
 * @apiVersion 4.6.1
 *
 * @apiName Init admin
 *
 * @apiGroup System
 *
 * @apiDescription This path creates the main administrator account. It can only be used once during installation
 *
 * @apiPermission any
 *
 * @apiParam {String} name Name of the administrator.
 * @apiParam {String} email Email of the administrator.
 * @apiParam {String} password Password of the administrator.
 *
 * @apiUse INVALID_NAME
 * @apiUse INVALID_EMAIL
 * @apiUse INVALID_PASSWORD
 * @apiUse INIT_SETTINGS_DONE
 *
 * @apiSuccess {Object} data Empty object
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
                    'validation' => DataValidator::notBlank()->length(2, 55),
                    'error' => ERRORS::INVALID_NAME
                ],
                'email' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
                ],
                'password' => [
                    'validation' => DataValidator::notBlank()->length(5, 200),
                    'error' => ERRORS::INVALID_PASSWORD
                ],
            ]
        ];
    }

    public function handler() {
        if(!Staff::isTableEmpty()) {
            throw new RequestException(ERRORS::INIT_SETTINGS_DONE);
        }

        $staff = new Staff();
        $staff->setProperties([
            'name' => Controller::request('name'),
            'email' => Controller::request('email'),
            'password' => Hashing::hashPassword(Controller::request('password')),
            'profilePic' => '',
            'level' => 3,
            'sharedDepartmentList' => Department::getAll(),
            'sharedTicketList' => [],
            'sendEmailOnNewTicket' => 1
        ]);
        
        foreach(Department::getAll() as $department) {
            $department->owners++;
            $department->store();
        }
        
        $staff->store();

        Response::respondSuccess();
    }
}