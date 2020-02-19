<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/delete-custom-field Delete custom field
 * @apiVersion 4.6.1
 *
 * @apiName Delete a custom field
 *
 * @apiGroup System
 *
 * @apiDescription This path deletes a custom field and all its uses.
 *
 * @apiPermission staff2
 *
 * @apiParam {Number} id Id of the custom field to delete.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_CUSTOM_FIELD
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class DeleteCustomFieldController extends Controller {
    const PATH = '/delete-custom-field';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_2',
            'requestData' => [
                'id' => [
                    'validation' => DataValidator::dataStoreId('customfield'),
                    'error' => ERRORS::INVALID_CUSTOM_FIELD,
                ],
            ]
        ];
    }

    public function handler() {
        $customField = Customfield::getDataStore(Controller::request('id'));

        foreach(User::getAll() as $user) {
            $customFieldValueList = $user->xownCustomfieldvalueList ? $user->xownCustomfieldvalueList : [];

            foreach($customFieldValueList as $customFieldValue) {
                if($customFieldValue->customfield->id == $customField->id) {
                    $user->xownCustomfieldvalueList->remove($customFieldValue);
                }
            }

            $user->store();
        }

        $customField->delete();

        Response::respondSuccess();
    }
}
