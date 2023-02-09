<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/edit-supervised-list Edit user list
 * @apiVersion 4.11.0
 *
 * @apiName Edit user list
 *
 * @apiGroup User
 *
 * @apiDescription This path edits the user list of a user.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number[]} userIdList The ids of the users.
 * @apiParam {Number} userId Id of the supervisor user.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_LIST
 * @apiUse INVALID_USER
 * @apiUse SUPERVISOR_CAN_NOT_SUPERVISE_HIMSELF
 * 
 * @apiSuccess {Object} data Empty object
 *
 */

class EditSupervisedListController extends Controller {
    const PATH = '/edit-supervised-list';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'userIdList' => [
                    'validation' => DataValidator::validUsersId(),
                    'error' => ERRORS::INVALID_LIST
                ],
                'userId' => [
                    'validation' => DataValidator::dataStoreId('user'),
                    'error' => ERRORS::INVALID_USER
                ]
            ]
        ];
    }

    public function handler() {
        $userIdList = $this->getUserIdListCleared();
        $superUser = User::getDataStore(Controller::request('userId'));
        
        if(!$superUser->supervisedrelation) {
            $superUser->supervisedrelation = new Supervisedrelation();
        }

        $superUser->supervisedrelation->sharedUserList->clear();
        foreach($userIdList as $userId) {
            $user = User::getDataStore($userId);

            $superUser->supervisedrelation->sharedUserList->add($user);
            
        }

        $superUser->supervisedrelation->store();
        $superUser->store();
        
        Response::respondSuccess();
    }
    
    public function getUserIdListCleared(){
        $clearedList = array_unique(json_decode(Controller::request('userIdList')));
        $superUser = User::getDataStore(Controller::request('userId'));

        foreach ($clearedList as $item) {
            if($item == $superUser->id) throw new Exception(ERRORS::SUPERVISOR_CAN_NOT_SUPERVISE_HIMSELF);
        }

        return $clearedList;
    }

}