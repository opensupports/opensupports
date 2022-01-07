<?php

use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /user/signup Sign up
 * @apiVersion 4.11.0
 *
 * @apiName Sign up
 *
 * @apiGroup User
 *
 * @apiDescription This path signs up an user on the system.
 *
 * @apiPermission any
 *
 * @apiParam {String} name The name of the new user.
 * @apiParam {String} email The email of the new user.
 * @apiParam {String} password The password of the new user.
 * @apiParam {String} apiKey apiKey to sign up an user if the registration system is disabled.
 * @apiParam {String} customfield_ Custom field values for this user.
 * @apiParam {Boolean} indirectSignUp Indicates if the new User has been created by ticket/create
 *
 * @apiUse INVALID_NAME
 * @apiUse INVALID_EMAIL
 * @apiUse INVALID_PASSWORD
 * @apiUse INVALID_CAPTCHA
 * @apiUse USER_EXISTS
 * @apiUse ALREADY_BANNED
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_CUSTOM_FIELD_OPTION
 *
 * @apiSuccess {Object} data Information about created user
 * @apiSuccess {Number} data.userId Id of the new user
 * @apiSuccess {String} data.userEmail Email of the new user
 *
 */

class SignUpController extends Controller {
    const PATH = '/signup';
    const METHOD = 'POST';

    private $userEmail;
    private $userName;
    private $userPassword;
    private $verificationToken;
    private $csvImported;

    public function __construct($csvImported = false) {
        $this->csvImported = $csvImported;
    }

    public function validations() {
        $validations = [
            'permission' => 'any',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::notBlank()->length(LengthConfig::MIN_LENGTH_NAME, LengthConfig::MAX_LENGTH_NAME),
                    'error' => ERRORS::INVALID_NAME
                ],
                'email' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
                ],
                'password' => [
                    'validation' => DataValidator::notBlank()->length(LengthConfig::MIN_LENGTH_PASSWORD, LengthConfig::MAX_LENGTH_PASSWORD),
                    'error' => ERRORS::INVALID_PASSWORD
                ]
            ]
        ];

        if(!$this->csvImported) {
            $validations['requestData']['captcha'] = [
                'validation' => DataValidator::captcha(APIKey::USER_CREATE_PERMISSION),
                'error' => ERRORS::INVALID_CAPTCHA
            ];
        }

        return $validations;
    }

    public function handler() {

        $this->storeRequestData();
        $apiKey = APIKey::getDataStore(Controller::request('apiKey'), 'token');

        $user = User::getUser($this->userEmail, 'email');
        
        if (!$user->isNull() && !$user->notRegistered) {
            throw new RequestException(ERRORS::USER_EXISTS);
        }
        $banRow = Ban::getDataStore($this->userEmail,'email');

        if (!$banRow->isNull()) {
            throw new RequestException(ERRORS::ALREADY_BANNED);
        }

        if (!Setting::getSetting('registration')->value && $apiKey->isNull() && !Controller::isStaffLogged(2) && !$this->csvImported) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }
        
        $userId = $this->createNewUserAndRetrieveId();

        if(MailSender::getInstance()->isConnected()) {
            $this->sendRegistrationMail();
        }

        Response::respondSuccess([
            'userId' => $userId,
            'userEmail' => $this->userEmail
        ]);

        Log::createLog('SIGNUP', null, User::getDataStore($userId));
    }

    public function storeRequestData() {
        $this->userName = Controller::request('name', true);
        $this->userEmail = Controller::request('email');
        $this->userPassword = Controller::request('password');
        $this->verificationToken = Hashing::generateRandomToken();
    }

    public function createNewUserAndRetrieveId() {
        $user = User::getUser($this->userEmail,'email');
        
        $userInstance = ($user->isNull() ? new User() : $user );
        $UserTickets = ($user->isNull() ? 0 : $user->tickets);

        $userInstance->setProperties([
            'name' => $this->userName,
            'signupDate' => Date::getCurrentDate(),
            'tickets' => $UserTickets,
            'email' => $this->userEmail,
            'password' => Hashing::hashPassword($this->userPassword),
            'verificationToken' => (MailSender::getInstance()->isConnected()) ? $this->verificationToken : null,
            'notRegistered' => Controller::request('indirectSignUp') ?  true : null,
            'xownCustomfieldvalueList' => $this->getCustomFieldValues()
        ]);

        return $userInstance->store();
    }

    public function sendRegistrationMail() {
        $mailSender = MailSender::getInstance();

        $mailSender->setTemplate(MailTemplate::USER_SIGNUP, [
            'to' => $this->userEmail,
            'name' => $this->userName,
            'url' => Setting::getSetting('url')->getValue(),
            'verificationToken' => $this->verificationToken
        ]);

        if(!Controller::request('indirectSignUp')) $mailSender->send();
    }
}
