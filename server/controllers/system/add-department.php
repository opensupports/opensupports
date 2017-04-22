<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/add-department Create a new department.
 *
 * @apiName Add department
 *
 * @apiGroup system
 *
 * @apiDescription This path create a new department.
 *
 * @apiPermission Staff level 3
 *
 * @apiParam {String} name Name of the new department.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_NAME
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
                    'validation' => DataValidator::alnum(),
                    'error' => ERRORS::INVALID_NAME
                ]
            ]
        ];
    }

    public function handler() {
        $name = Controller::request('name');
        
        $departmentInstance = new Department();
        
        $departmentInstance->setProperties([
            'name' => $name,
        ]);
        $departmentInstance->store();

        Log::createLog('ADD_DEPARTMENT', $name);

        Response::respondSuccess();

    }
}