<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /user/get-user Give back the information of an specific user.
 *
 * @apiName get-user
 *
 * @apiGroup User
 *
 * @apiDescription This path give back information about an specific user.
 *
 * @apiPermission Staff level 1
 *
 * @apiParam {string} userId The id of the user to find information of.
 *
 * @apiError {String} message
 *
 * @apiSuccess {Object} data
 *
 */

class GetUserByIdController extends Controller {
    const PATH = '/get-user';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'userId' => [
                    'validation' => DataValidator::dataStoreId('user'),
                    'error' => ERRORS::INVALID_USER
                ]
            ]
        ];
    }

    public function handler() {
        
        if(!Controller::isUserSystemEnabled()) {
            throw new Exception(ERRORS::USER_SYSTEM_DISABLED);
        }
        
        $userId = Controller::request('userId');
        $user = User::getDataStore($userId);
        $staff = Controller::getLoggedUser();
        
        $tickets = new DataStoreList();
        
        foreach($user->sharedTicketList as $ticket) {
            if($staff->sharedDepartmentList->includesId($ticket->department->id)) {
                $tickets->add($ticket);
            }
        }

        Response::respondSuccess([
            'name' => $user->name,
            'email' => $user->email,
            'signupDate' => $user->signupDate,
            'tickets' => $tickets->toArray(),
            'verified' => !$user->verificationToken
        ]);
    }
}