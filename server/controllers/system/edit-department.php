<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /system/edit-department Edit department
 * @apiVersion 4.11.0
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
 * @apiParam {Boolean} private Indicates if the department is shown to users;
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_NAME
 * @apiUse INVALID_DEPARTMENT
 * @apiUse NAME_ALREADY_USED
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
                'departmentId' => [
                    'validation' => DataValidator::dataStoreId('department'),
                    'error' => ERRORS::INVALID_DEPARTMENT
                ],
                'name' => [
                    'validation' => DataValidator::notBlank()->length(LengthConfig::MIN_LENGTH_NAME, LengthConfig::MAX_LENGTH_NAME),
                    'error' => ERRORS::INVALID_NAME
                ],
            ]
        ];
    }

    public function handler() {
        $newName = Controller::request('name');
        $departmentId = Controller::request('departmentId');
        $private = Controller::request('private');

        $departmentInstance = Department::getDataStore($departmentId);
        $createdDepartment = Department::getDataStore($newName, 'name');
        
        if(!$createdDepartment->isNull() && $createdDepartment->name !== $departmentInstance->name){
            throw new RequestException(ERRORS::NAME_ALREADY_USED);
        }

        if($private && $departmentId == Setting::getSetting('default-department-id')->getValue()){
            throw new RequestException(ERRORS::DEFAULT_DEPARTMENT_CAN_NOT_BE_PRIVATE);
        }
        
        if($private && Ticket::count(' author_id IS NOT NULL AND department_id = ? ', [$departmentId])) {
            throw new RequestException(ERRORS::DEPARTMENT_PRIVATE_TICKETS);
        }

        if($newName) $departmentInstance->name = $newName;
        $departmentInstance->private = $private ? 1 : 0;
        $departmentInstance->store();

        Log::createLog('EDIT_DEPARTMENT', $departmentInstance->name);

        Response::respondSuccess();

    }
}
