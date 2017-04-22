<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/edit-custom-response Edit a custom response.
 *
 * @apiName Edit custom response
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path edit a custom response.
 *
 * @apiPermission Staff level 2
 *
 * @apiParam {Number} id Id of the custom response to edit.
 * @apiParam {String} content The new content of the custom response.
 * @apiParam {String} language The new language of the custom response.
 * @apiParam {String} name The new name of the custom response.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_NAME
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class EditCustomResponseController extends Controller {
    const PATH = '/edit-custom-response';
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

        if (Controller::request('content')) {
            $customResponse->content = Controller::request('content', true);
        }

        if (Controller::request('language')) {
            $customResponse->language = Controller::request('language');
        }

        if (Controller::request('name')) {
            $customResponse->name = Controller::request('name');
        }

        $customResponse->store();

        Log::createLog('EDIT_CUSTOM_RESPONSE', null);
        Response::respondSuccess();
    }
}