<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/add-custom-response Add new responses.
 *
 * @apiName Add custom response
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path allows create new responses to tickets.
 *
 * @apiPermission Staff Level 2
 *
 * @apiParam {String} name Name of the response.
 *
 * @apiParam {String} content Content of the response.
 *
 * @apiParam {String} language Language of the response.
 *
 * @apiError {String} message
 *
 * @apiSuccess {Object} data
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
                    'validation' => DataValidator::length(5, 100),
                    'error' => ERRORS::INVALID_NAME
                ],
                'content' => [
                    'validation' => DataValidator::length(20, 500),
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
            'content' => Controller::request('content'),
            'language' => Controller::request('language')
        ]);
        $customResponse->store();

        Log::createLog('ADD_CUSTOM_RESPONSE', null);

        Response::respondSuccess();
    }
}