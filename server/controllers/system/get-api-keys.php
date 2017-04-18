<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/get-api-keys Get api keys.
 *
 * @apiName Get api keys
 *
 * @apiGroup system
 *
 * @apiDescription This path give back the all api keys.
 *
 * @apiPermission Staff level 3
 *
 * @apiSuccess {Object} data
 *
 */

class GetAPIKeysController extends Controller {
    const PATH = '/get-api-keys';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }

    public function handler() {
        $apiList = APIKey::getAll();
        
        Response::respondSuccess($apiList->toArray());
    }
}