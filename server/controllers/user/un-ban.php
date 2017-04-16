<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/un-ban take a user out of banned list.
 *
 * @apiName un ban
 *
 * @apiGroup User
 *
 * @apiDescription This path take a user out of banned list.
 *
 * @apiPermission Staff level 1
 *
 * @apiParam {string} email  the email of the user who was banned.
 *
 * @apiError {String} message
 *
 * @apiSuccess {Object} data
 *
 */

class UnBanUserController extends Controller {
    const PATH = '/un-ban';
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
        $banRow = Ban::getDataStore($email,'email');
        
        if($banRow->isNull()) {
            Response::respondError(ERRORS::INVALID_EMAIL);
        } else {
            $banRow->delete();
            
            Log::createLog('UN_BAN_USER', $email);

            Response::respondSuccess();
        }
    }
        
}