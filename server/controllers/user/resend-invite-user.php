<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /user/resend-invite-user resend invite user
 * @apiVersion 4.11.0
 *
 * @apiName Resend resend invite user
 *
 * @apiGroup User
 *
 * @apiDescription This path resend invitation to a user
 *
 * @apiPermission staff1
 *
 * @apiParam {String} email The email of the new user.
 * 
 * @apiUse ALREADY_BANNED
 * @apiUse INVALID_EMAIL
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class ResendInviteUserController extends Controller {
    const PATH = '/resend-invite-user';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'email' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
                ]                
            ]
        ];
    }

    public function handler() {
        $email = Controller::request('email');

        $userRow = User::getDataStore($email, 'email');
        $banRow = Ban::getDataStore($email,'email');
        $recoverPassword = RecoverPassword::getDataStore($email, 'email');

        if(!$banRow->isNull()) throw new RequestException(ERRORS::ALREADY_BANNED);
        if($userRow->isNull() || $recoverPassword->isNull() || $recoverPassword->staff != 0) throw new RequestException(ERRORS::INVALID_EMAIL);

        $this->sendInvitationMail($userRow, $recoverPassword->token);

        Response::respondSuccess();

        Log::createLog('INVITE', $userRow->name);
    }

    public function sendInvitationMail($userRow, $token) {
        $mailSender = MailSender::getInstance();

        $mailSender->setTemplate(MailTemplate::USER_INVITE, [
            'to' => $userRow->email,
            'name' => $userRow->name,
            'url' => Setting::getSetting('url')->getValue(),
            'token' => $token
        ]);

        $mailSender->send();
    }
}