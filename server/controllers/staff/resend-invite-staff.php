<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /staff/resend-invite-staff resend invite staff
 * @apiVersion 4.11.0
 *
 * @apiName Resend resend invite staff
 *
 * @apiGroup Staff
 *
 * @apiDescription This path resend invitation to a staff
 *
 * @apiPermission staff3
 *
 * @apiParam {String} email The email of the new staff member.
 * 
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_NAME
 * @apiUse INVALID_EMAIL
 * @apiUse INVALID_PASSWORD
 * @apiUse INVALID_LEVEL
 * @apiUse ALREADY_A_STAFF
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class ResendInviteStaffController extends Controller {
    const PATH = '/resend-invite-staff';
    const METHOD = 'POST';

    private $email;

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'email' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
                ]                
            ]
        ];
    }

    public function handler() {
        $this->email = Controller::request('email');

        $staffRow = Staff::getDataStore($this->email, 'email');
        $recoverPassword = RecoverPassword::getDataStore($this->email, 'email');

        if($staffRow->isNull() || $recoverPassword->isNull() || $recoverPassword->staff != 1) throw new RequestException(ERRORS::INVALID_EMAIL);

        $this->sendInvitationMail($staffRow, $recoverPassword->token);

        Response::respondSuccess();

        Log::createLog('INVITE', $staffRow->name);
    }

    public function sendInvitationMail($staffRow, $token) {
        $mailSender = MailSender::getInstance();

        $mailSender->setTemplate(MailTemplate::USER_INVITE, [
            'to' => $staffRow->email,
            'name' => $staffRow->name,
            'url' => Setting::getSetting('url')->getValue(),
            'token' => $token
        ]);

        $mailSender->send();
    }
}