<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/delete-custom-response Delete custom response
 * @apiVersion 4.6.1
 *
 * @apiName Delete custom response
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path deletes a custom response.
 *
 * @apiPermission user
 *
 * @apiParam {Number} id Id of the custom response to delete.
 *
 * @apiUse NO_PERMISSION
 * 
 * @apiSuccess {Object} data Empty object
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