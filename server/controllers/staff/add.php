<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /staff/add Add staff
 * @apiVersion 4.4.0
 *
 * @apiName Add staff
 *
 * @apiGroup Staff
 *
 * @apiDescription This path adds a new staff member.
 *
 * @apiPermission staff3
 *
 * @apiParam {String} name The name of the new staff member.
 * @apiParam {String} email The email of the new staff member.
 * @apiParam {String} password The password of the new staff member.
 * @apiParam {Number} level The level of the new staff member.
 * @apiParam {String} profilePic The profile pic of the new staff member.
 * @apiParam {Number[]} departments The departments that will have assigned the new staff member.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_NAME
 * @apiUse INVALID_EMAIL
 * @apiUse INVALID_PASSWORD
 * @apiUse INVALID_LEVEL
 * @apiUse ALREADY_A_STAFF
 *
 * @apiSuccess {Object} data Staff info object
 * @apiSuccess {Number} data.id Staff id
 *
 */

class AddStaffController extends Controller {
    const PATH = '/add';
    const METHOD = 'POST';

    private $name;
    private $email;
    private $password;
    private $profilePic;
    private $level;
    private $departments;


    public function validations() {
        return [
            'permission' => 'staff_3',
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
                'level' => [
                    'validation' => DataValidator::between(1, 3, true),
                    'error' => ERRORS::INVALID_LEVEL
                ]

            ]
        ];
    }

    public function handler() {
        $this->storeRequestData();
        $staff = new Staff();

        $staffRow = Staff::getDataStore($this->email,'email');

        if($staffRow->isNull()) {
            $staff->setProperties([
                'name'=> $this->name,
                'email' => $this->email,
                'password'=> Hashing::hashPassword($this->password),
                'profilePic' => $this->profilePic,
                'level' => $this->level,
                'sharedDepartmentList' => $this->getDepartmentList()

            ]);
            
            $this->addOwner();
            
            Log::createLog('ADD_STAFF', $this->name);
            
            Response::respondSuccess([
                'id' => $staff->store()
            ]);
            return;
        }

        throw new RequestException(ERRORS::ALREADY_A_STAFF);
    }

    public function storeRequestData() {
        $this->name = Controller::request('name');
        $this->email = Controller::request('email');
        $this->password = Controller::request('password');
        $this->profilePic = Controller::request('profilePic');
        $this->level = Controller::request('level');
        $this->departments = Controller::request('departments');
    }

    public function getDepartmentList() {
        $listDepartments = new DataStoreList();
        $departmentIds = json_decode($this->departments);

        foreach($departmentIds as $id) {
            $department = Department::getDataStore($id);
            $listDepartments->add($department);
        }

        return $listDepartments;
    }
    public function addOwner() {
        $departmentIds = json_decode($this->departments);

        foreach($departmentIds as $id) {
            $departmentRow = Department::getDataStore($id);
            $departmentRow->owners++;
            $departmentRow->store();
        }
    }
}