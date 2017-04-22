<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /staff/edit Edit a staff member.
 *
 * @apiName Edit
 *
 * @apiGroup staff
 *
 * @apiDescription This path edits a staff member .
 *
 * @apiPermission Staff level 1
 *
 * @apiParam {Number} staffId Id of the staff.
 * @apiParam {String} departments The name of the departments to change.
 * @apiParam {String} email The new email of the staff member.
 * @apiParam {String} password The new password of the staff member.
 * @apiParam {Number} level The new level of the staff member.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_STAFF
 *
 * @apiSuccess {Object} data Empty object 
 *
 */

class EditStaffController extends Controller {
    const PATH = '/edit';
    const METHOD = 'POST';

    private $staffInstance;

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => []
        ];
    }

    public function handler() {
        $staffId = Controller::request('staffId');

        if(!$staffId) {
            $this->staffInstance = Controller::getLoggedUser();
        } else if(Controller::isStaffLogged(3)) {
            $this->staffInstance = Staff::getDataStore($staffId, 'id');

            if($this->staffInstance->isNull()) {
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

    private function editInformation() {

        if(Controller::request('email')) {
            $this->staffInstance->email = Controller::request('email');
        }

        if(Controller::request('password')) {
            $this->staffInstance->password = Hashing::hashPassword(Controller::request('password'));
        }
        
        if(Controller::request('level') && Controller::isStaffLogged(3) && Controller::request('staffId') !== Controller::getLoggedUser()->id) {
            $this->staffInstance->level = Controller::request('level');
        }
        
        if(Controller::request('departments') && Controller::isStaffLogged(3)) {
            $this->staffInstance->sharedDepartmentList = $this->getDepartmentList();
        }

        if($fileUploader = $this->uploadFile(true)) {
            $this->staffInstance->profilePic = ($fileUploader instanceof FileUploader) ? $fileUploader->getFileName() : null;
        }

        $this->staffInstance->store();
    }


    private function getDepartmentList() {
        $listDepartments = new DataStoreList();
        $departmentIds = json_decode(Controller::request('departments'));

        foreach($departmentIds as $id) {
            $department = Department::getDataStore($id);
            $listDepartments->add($department);
        }

        return $listDepartments;
    }

    private function updateDepartmentsOwners() {
        $list1 = $this->staffInstance->sharedDepartmentList;
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