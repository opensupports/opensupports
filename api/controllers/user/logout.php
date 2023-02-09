<?php
/**
 * @api {post} /user/logout Log out
 * @apiVersion 4.11.0
 *
 * @apiName Log out 
 *
 * @apiGroup User
 *
 * @apiDescription This path logs out the current user.
 *
 * @apiPermission any
 *
 * @apiUse NO_PERMISSION
 * 
 * @apiSuccess {Object} data Empty object
 *
 */
class LogoutController extends Controller {
    const PATH = '/logout';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'user',
            'requestData' => []
        ];
    }

    public function handler() {
        $session = Session::getInstance();
        $session->closeSession();

        Response::respondSuccess();
    }
}