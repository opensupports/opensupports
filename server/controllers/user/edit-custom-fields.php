<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/edit-custom-fields Edit custom field values
 * @apiVersion 4.6.1
 *
 * @apiName Edit custom field values
 *
 * @apiGroup User
 *
 * @apiDescription This path is for editing the custom fields of a user.
 *
 * @apiPermission user
 *
 * @apiParam {String} userId Id of the user if it is not the one logged. Optional.
 * @apiParam {String} customfield_ Custom field values for this user.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_CUSTOM_FIELD_OPTION
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class EditCustomFieldsController extends Controller {
    const PATH = '/edit-custom-fields';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'user',
            'requestData' => []
        ];
    }

    public function handler() {
        $userId = Controller::request('userId') * 1;
        $user = Controller::getLoggedUser();

        if($userId && Controller::isStaffLogged(2)) {
            $user = User::getDataStore($userId);

            if($user->isNull())
                throw new RequestException(ERRORS::INVALID_USER);
        }

        $user->setProperties([
            'xownCustomfieldvalueList' => $this->getCustomFieldValues()
        ]);

        $user->store();
        Response::respondSuccess();
    }
}
