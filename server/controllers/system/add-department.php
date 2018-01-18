<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/add-department Add department
 * @apiVersion 4.1.0
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
            'requestData' => []
        ];
    }

    public function handler() {
        $name = htmlentities(Controller::request('name'));

        $departmentInstance = new Department();

        $departmentInstance->setProperties([
            'name' => $name,
        ]);
        $departmentInstance->store();

        Log::createLog('ADD_DEPARTMENT', $name);

        Response::respondSuccess();

    }
}
