<?php
/**
 * @api {post} /user/logout Log out
 * @apiVersion 4.6.1
 *
 * @apiName Log out 
 *
 * @apiGroup User
 *
 * @apiDescription This path logs out the current user.
 *
 * @apiPermission any
 *
 * @apiSuccess {Object} data Empty object
 *
 */
class LogoutController extends Controller {
    const PATH = '/logout';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        $session = Session::getInstance();
        $session->closeSession();

        Response::respondSuccess();
    }
}