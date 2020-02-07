<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/add-department Add department
 * @apiVersion 4.6.1
 *
 * @apiName Add department
 *
 * @apiGroup System
 *
 * @apiDescription This path create a new department.
 *
 * @apiPermission staff3
 *
 * @apiParam {String} name Name of the new department.
 * @apiParam {Boolean} private Indicates if the deparment is not shown to users.
 *
 * @apiUse NO_PERMISSION
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class AddDepartmentController extends Controller {
    const PATH = '/add-department';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::notBlank()->length(2, 100),
                    'error' => ERRORS::INVALID_NAME
                ]
            ]
        ];
    }

    public function handler() {
        $name = Controller::request('name');
        $private = Controller::request('private');

        $departmentInstance = new Department();

        $departmentInstance->setProperties([
            'name' => $name ,
            'private' => $private ? 1 : 0
        ]);
        $departmentInstance->store();

        Log::createLog('ADD_DEPARTMENT', $name);

        Response::respondSuccess();

    }
}
