<?php
use Respect\Validation\Validator as DataValidator;

class EditStaffController extends Controller {
    const PATH = '/edit';

    private $staffRow;
    private $staffId;

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'staffId' =>[
                    'validation' => DataValidator::dataStoreId('staff'),
                    'error' => ERRORS::INVALID_STAFF
                ]
            ]
        ];
    }

    public function handler() {
        $this->staffId = Controller::request('staffId');

        if(!$this->staffId) {
            $this->staffRow = Controller::getLoggedUser();
        } else {
            $this->staffRow = Staff::getDataStore($this->staffId,'id');
        }

        $this->editInformation();
        Response::respondSuccess();
     }

    public function editInformation() {

        if(Controller::request('email')) {
            $this->staffRow->email = Controller::request('email');
        }

        if(Controller::request('password')) {
            $this->staffRow->password = Controller::request('password');
        }
        if(Controller::request('level')) {
            $this->staffRow->level = Controller::request('level');
        }
        if(Controller::request('departments')) {
            $this->staffRow->sharedDepartmentList = $this->getDepartmentList();
        }

        $this->staffRow->store();
    }


    public function getDepartmentList() {
        $listDepartments = new DataStoreList();
        $departmentIds = json_decode(Controller::request('departments'));

        foreach($departmentIds as $id) {
            $department = Department::getDataStore($id);
            $listDepartments->add($department);
        }

        return $listDepartments;
    }
}