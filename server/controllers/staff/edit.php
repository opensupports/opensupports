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
}