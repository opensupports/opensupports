<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/get-custom-responses Retrieve customs responses.
 *
 * @apiName Get custom responses
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path give back custom responses.
 *
 * @apiPermission Staff level 1
 *
 * @apiUse NO_PERMISSION
 * 
 * @apiSuccess {[CustomResponse](#api-Data_Structures-ObjectCustomresponse)[]} data List of custom responses.
 *
 */

class GetCustomResponsesController extends Controller {
    const PATH = '/get-custom-responses';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => []
        ];
    }

    public function handler() {
        $customResponsesList = CustomResponse::getAll();
        
        Response::respondSuccess($customResponsesList->toArray());
    }
}