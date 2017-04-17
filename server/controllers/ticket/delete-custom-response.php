<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/delete-custom-response Delete a custom response.
 *
 * @apiName Delete custom response
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path delete a custom response.
 *
 * @apiPermission user
 *
 * @apiParam {number} id Id of the custom response to delete.
 *
 * @apiError {String} message
 *
 * @apiSuccess {Object} data
 *
 */

class DeleteCustomResponseController extends Controller {
    const PATH = '/delete-custom-response';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_2',
            'requestData' => [
                'id' => [
                    'validation' => DataValidator::dataStoreId('customresponse'),
                    'error' => ERRORS::INVALID_NAME
                ]
            ]
        ];
    }

    public function handler() {
        $customResponse = CustomResponse::getDataStore(Controller::request('id'));
        $customResponse->delete();

        Log::createLog('DELETE_CUSTOM_RESPONSE', null);
        
        Response::respondSuccess();
    }
}