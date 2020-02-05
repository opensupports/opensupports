<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /staff/edit Edit staff
 * @apiVersion 4.6.1
 *
 * @apiName Edit staff
 *
 * @apiGroup Staff
 *
 * @apiDescription This path edits a staff member.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} staffId Id of the staff.
 * @apiParam {String} departments The name of the departments to change. Optional.
 * @apiParam {String} email The new email of the staff member. Optional.
 * @apiParam {String} password The new password of the staff member. Optional.
 * @apiParam {Number} level The new level of the staff member. Optional.
 * @apiParam {Boolean} sendEmailOnNewTicket Indicates if it receives an email when a new ticket is created.
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
            'requestData' => [
                'email' => [
                    'validation' => DataValidator::oneOf(DataValidator::email(), DataValidator::falseVal()),
                    'error' => ERRORS::INVALID_EMAIL
                ],
                'password' => [
                    'validation' => DataValidator::oneOf(DataValidator::notBlank()->length(5, 200), DataValidator::falseVal()),
                    'error' => ERRORS::INVALID_PASSWORD
                ],
                'level' => [
                    'validation' => DataValidator::oneOf(DataValidator::between(1, 3, true), DataValidator::falseVal()),
                    'error' => ERRORS::INVALID_LEVEL
                ]

            ]
        ];
    }

    public function handler() {
        $staffId = Controller::request('staffId');

        if(!$staffId) {
            $this->staffInstance = Controller::getLoggedUser();
        } else if(Controller::isStaffLogged(3) || ((Controller::isStaffLogged() && Controller::getLoggedUser()->id == $staffId)) ) {
            $this->staffInstance = Staff::getDataStore($staffId, 'id');

            if($this->staffInstance->isNull()) {
                throw new RequestException(ERRORS::INVALID_STAFF);
                return;
            }
        } else {
            throw new RequestException(ERRORS::NO_PERMISSION);
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

        if(Controller::request('level') && Controller::isStaffLogged(3) && !$this->isModifyingCurrentStaff()) {
            $this->staffInstance->level = Controller::request('level');
        }

        if(Controller::request('departments') && Controller::isStaffLogged(3)) {
            $departmentList = $this->getDepartmentList();
            $ticketList = $this->staffInstance->sharedTicketList;

            $this->staffInstance->sharedDepartmentList = $departmentList;

            foreach($ticketList as $ticket) {
                if(!$departmentList->includesId($ticket->department->id)) {
                    if($ticket->isOwner($this->staffInstance) ) {
                        $ticket->owner = null;
                    }

                    if(!$ticket->isAuthor($this->staffInstance)) {
                        $this->staffInstance->sharedTicketList->remove($ticket);
                    }

                    $ticket->store();
                }
            }
        }

        $fileUploader = FileUploader::getInstance();
        $fileUploader->setPermission(FileManager::PERMISSION_PROFILE);

        if($fileUploader = $this->uploadFile(true)) {
            $this->staffInstance->profilePic = ($fileUploader instanceof FileUploader) ? $fileUploader->getFileName() : null;
        }

	    if(Controller::request('sendEmailOnNewTicket') !== null && Controller::request('sendEmailOnNewTicket') !== '' && $this->isModifyingCurrentStaff()) {
            $this->staffInstance->sendEmailOnNewTicket = intval(Controller::request('sendEmailOnNewTicket'));
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

    private function isModifyingCurrentStaff() {
        return !Controller::request('staffId') || Controller::request('staffId') === Controller::getLoggedUser()->id;
    }
}
