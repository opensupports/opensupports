<?php
use Respect\Validation\Validator as DataValidator;

class EditStaffController extends Controller {
    const PATH = '/edit';

    private $staffRow;
    private $staffId;

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => []
        ];
    }

    public function handler() {
        $this->staffId = Controller::request('staffId');

        if(!$this->staffId) {
            $this->staffRow = Controller::getLoggedUser();
        } else if(Controller::isStaffLogged(3)) {
            $this->staffRow = Staff::getDataStore($this->staffId, 'id');

            if($this->staffRow->isNull()) {
                Response::respondError(ERRORS::INVALID_STAFF);
                return;
            }
        } else {
            Response::respondError(ERRORS::NO_PERMISSION);
            return;
        }
        
        if(Controller::request('departments')) {
            $this->updateDepartmentsOwners();    
        }

        $this->editInformation();
        Response::respondSuccess();
     }

    public function editInformation() {

        if(Controller::request('email')) {
            $this->staffRow->email = Controller::request('email');
        }

        if(Controller::request('password')) {
            $this->staffRow->password = Hashing::hashPassword(Controller::request('password'));
        }
        
        if(Controller::request('level') && Controller::isStaffLogged(3)) {
            $this->staffRow->level = Controller::request('level');
        }
        
        if(Controller::request('departments') && Controller::isStaffLogged(3)) {
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

    public function updateDepartmentsOwners() {
        $list1 = $this->staffRow->sharedDepartmentList;
        $list2 = $this->getDepartmentList();

        foreach ($list1 as $department1) {
            $match = false;

            foreach ($list2 as $department2) {
                if($department1->id == $department2->id) {
                    $match = true;
                }
            }

            if(!$match) {
                $department1->owners--;
                $department1->store();
            }
        }

        foreach ($list2 as $department2) {
            $match = false;

            foreach ($list1 as $department1) {
                if($department2->id == $department1->id) {
                    $match = true;
                }
            }

            if(!$match) {
                $department2->owners++;
                $department2->store();
            }
        }
    }
}