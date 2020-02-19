<?php

use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /user/invite Invite
 * @apiVersion 4.6.1
 *
 * @apiName Invite
 *
 * @apiGroup User
 *
 * @apiDescription This path invites an user on the system.
 *
 * @apiPermission staff1
 *
 * @apiParam {String} name The name of the invited user.
 * @apiParam {String} email The email of the invited user.
 * @apiParam {String} customfield_ Custom field values for this user.
 *
 * @apiUse INVALID_NAME
 * @apiUse INVALID_EMAIL
 * @apiUse INVALID_CAPTCHA
 * @apiUse USER_EXISTS
 * @apiUse ALREADY_BANNED
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_CUSTOM_FIELD_OPTION
 *
 * @apiSuccess {Object} data Information about invited user
 * @apiSuccess {Number} data.userId Id of the invited user
 * @apiSuccess {String} data.userEmail Email of the invited user
 *
 */

class InviteUserController extends Controller {
    const PATH = '/invite';
    const METHOD = 'POST';

    private $userEmail;
    private $userName;

    public function validations() {
        $validations = [
            'permission' => 'staff_1',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::notBlank()->length(2, 55),
                    'error' => ERRORS::INVALID_NAME
                ],
                'email' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
                ]
            ]
        ];

        $validations['requestData']['captcha'] = [
            'validation' => DataValidator::captcha(),
            'error' => ERRORS::INVALID_CAPTCHA
        ];

        return $validations;
    }

    public function handler() {
        if (!Controller::isUserSystemEnabled()) {
            throw new RequestException(ERRORS::USER_SYSTEM_DISABLED);
        }

        $this->storeRequestData();

        $existentUser = User::getUser($this->userEmail, 'email');

        if (!$existentUser->isNull()) {
            throw new RequestException(ERRORS::USER_EXISTS);
        }

        $banRow = Ban::getDataStore($this->userEmail, 'email');

        if (!$banRow->isNull()) {
            throw new RequestException(ERRORS::ALREADY_BANNED);
        }

        $userId = $this->createNewUserAndRetrieveId();

        $this->token = Hashing::generateRandomToken();

        $recoverPassword = new RecoverPassword();
        $recoverPassword->setProperties(array(
            'email' => $this->userEmail,
            'token' => $this->token,
            'staff' => false
        ));
        $recoverPassword->store();

        $this->sendInvitationMail();

        Response::respondSuccess([
            'userId' => $userId,
            'userEmail' => $this->userEmail
        ]);

        Log::createLog('INVITE', $this->userName);
    }

    public function storeRequestData() {
        $this->userName = Controller::request('name');
        $this->userEmail = Controller::request('email');
    }

    public function createNewUserAndRetrieveId() {
        $userInstance = new User();

        $userInstance->setProperties([
            'name' => $this->userName,
            'signupDate' => Date::getCurrentDate(),
            'tickets' => 0,
            'email' => $this->userEmail,
            'password' => Hashing::hashPassword(Hashing::generateRandomToken()),
            'verificationToken' => null,
            'xownCustomfieldvalueList' => $this->getCustomFieldValues()
        ]);

        return $userInstance->store();
    }

    public function sendInvitationMail() {
        $mailSender = MailSender::getInstance();

        $mailSender->setTemplate(MailTemplate::USER_INVITE, [
            'to' => $this->userEmail,
            'name' => $this->userName,
            'url' => Setting::getSetting('url')->getValue(),
            'token' => $this->token
        ]);

        $mailSender->send();
    }
}
