<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/add-custom-response Add custom responses
 * @apiVersion 4.6.1
 *
 * @apiName Add a custom response
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path allows add new custom responses for tickets.
 *
 * @apiPermission staff2
 *
 * @apiParam {String} name Name of the response.
 * @apiParam {String} content Content of the response.
 * @apiParam {String} language Language of the response.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_NAME
 * @apiUse INVALID_CONTENT
 * @apiUse INVALID_LANGUAGE
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class AddCustomResponseController extends Controller {
    const PATH = '/add-custom-response';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_2',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::notBlank()->length(5, 100),
                    'error' => ERRORS::INVALID_NAME
                ],
                'content' => [
                    'validation' => DataValidator::content(),
                    'error' => ERRORS::INVALID_CONTENT
                ],
                'language' => [
                    'validation' => DataValidator::validLanguage(),
                    'error' => ERRORS::INVALID_LANGUAGE
                ]
            ]
        ];
    }

    public function handler() {
        $customResponse = new CustomResponse();
        $customResponse->setProperties([
            'name' => Controller::request('name'),
            'content' => Controller::request('content', true),
            'language' => Controller::request('language')
        ]);
        $customResponse->store();

        Log::createLog('ADD_CUSTOM_RESPONSE', null);

        Response::respondSuccess();
    }
}
