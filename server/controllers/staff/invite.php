<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /staff/invite Invite staff
 * @apiVersion 4.6.1
 *
 * @apiName Invite staff
 *
 * @apiGroup Staff
 *
 * @apiDescription This path invites a new staff member.
 *
 * @apiPermission staff3
 *
 * @apiParam {String} name The name of the new staff member.
 * @apiParam {String} email The email of the new staff member.
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

class InviteStaffController extends Controller {
    const PATH = '/invite';
    const METHOD = 'POST';

    private $name;
    private $email;
    private $profilePic;
    private $level;
    private $departments;

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::notBlank()->length(2, 55),
                    'error' => ERRORS::INVALID_NAME
                ],
                'email' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
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

        $staffRow = Staff::getDataStore($this->email, 'email');

        if(!$staffRow->isNull()) throw new RequestException(ERRORS::ALREADY_A_STAFF);

        $staff = new Staff();
        $staff->setProperties([
            'name'=> $this->name,
            'email' => $this->email,
            'password'=> Hashing::hashPassword(Hashing::generateRandomToken()),
            'profilePic' => $this->profilePic,
            'level' => $this->level,
            'sharedDepartmentList' => $this->getDepartmentList()
        ]);

        $this->addOwner();

        $this->token = Hashing::generateRandomToken();

        $recoverPassword = new RecoverPassword();
        $recoverPassword->setProperties(array(
            'email' => $this->email,
            'token' => $this->token,
            'staff' => true
        ));
        $recoverPassword->store();

        $this->sendInvitationMail();

        Response::respondSuccess([
            'id' => $staff->store()
        ]);

        Log::createLog('INVITE', $this->name);
    }

    public function storeRequestData() {
        $this->name = Controller::request('name');
        $this->email = Controller::request('email');
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

    public function sendInvitationMail() {
        $mailSender = MailSender::getInstance();

        $mailSender->setTemplate(MailTemplate::USER_INVITE, [
            'to' => $this->email,
            'name' => $this->name,
            'url' => Setting::getSetting('url')->getValue(),
            'token' => $this->token
        ]);

        $mailSender->send();
    }
}