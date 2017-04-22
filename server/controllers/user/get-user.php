<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /user/get-user Retrieve the information of an specific user.
 *
 * @apiName Get-user
 *
 * @apiGroup User
 *
 * @apiDescription This path retrieves information about an specific user.
 *
 * @apiPermission Staff level 1
 *
 * @apiParam {String} userId The id of the user to find information of.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_USER
 * @apiUse USER_SYSTEM_DISABLED
 *
 * @apiSuccess {Object} data Information about a user
 * @apiSuccess {String} data.name Name of the user
 * @apiSuccess {String} data.email Email of the user
 * @apiSuccess {Number} data.signupDate Date of signup of the user
 * @apiSuccess {[Ticket](#api-Data_Structures-ObjectTicket)[]} data.tickets Array of tickets of the user
 * @apiSuccess {Boolean} data.verified Indicates if the user is verified
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