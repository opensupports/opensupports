<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/list-ban Give back the list of banned users.
 *
 * @apiName list-ban
 *
 * @apiGroup User
 *
 * @apiDescription This path give back the list of banned users.
 *
 * @apiPermission Staff level 1
 *
 * @apiSuccess {Object} data
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