<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/list-ban Get ban list
 * @apiVersion 4.6.1
 *
 * @apiName Get ban list
 *
 * @apiGroup User
 *
 * @apiDescription This path retrieves the list of banned emails.
 *
 * @apiPermission staff1
 *
 * @apiUse NO_PERMISSION
 * 
 * @apiSuccess {[Ban](#api-Data_Structures-ObjectBan)[]} data Array of emails banned
 *
 */

class ListBanUserController extends Controller {
    const PATH = '/list-ban';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => []
        ];
    }

    public function handler() {
        $banList = Ban::getAll()->toArray();
        Response::respondSuccess($banList);
    }
}