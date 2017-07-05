<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /system/edit-department Edit department
 * @apiVersion 4.1.0
 *
 * @apiName Edit department
 *
 * @apiGroup System
 *
 * @apiDescription This path edits a department's name.
 *
 * @apiPermission staff3
 *
 * @apiParam {String} name The new name of the department.
 * @apiParam {Number} departmentId The Id of the department.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_NAME
 * @apiUse INVALID_DEPARTMENT
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class EditDepartmentController extends Controller {
    const PATH = '/edit-department';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::alnum(),
                    'error' => ERRORS::INVALID_NAME
                ],
                'departmentId' => [
                    'validation' => DataValidator::dataStoreId('department'),
                    'error' => ERRORS::INVALID_DEPARTMENT
                ]
            ]
        ];
    }

    public function handler() {
        $newname = Controller::request('name');
        $departmentId = Controller::request('departmentId');

        $departmentInstance = Department::getDataStore($departmentId);

        $departmentInstance->name = $newname ;

        $departmentInstance->store();

        Log::createLog('EDIT_DEPARTMENT', $departmentInstance->name);
        
        Response::respondSuccess();

    }
}