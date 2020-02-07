<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/get-api-keys Get APIKeys
 * @apiVersion 4.6.1
 *
 * @apiName Get APIKeys
 *
 * @apiGroup System
 *
 * @apiDescription This path retrieves the all APIKeys.
 *
 * @apiPermission staff3
 *
 * @apiUse NO_PERMISSION
 * 
 * @apiSuccess {[APIKey](#api-Data_Structures-ObjectApikey)[]} data Array of APIKeys
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