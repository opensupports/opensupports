<?php
/**
 * @api {post} /user/logout Log out the current user.
 *
 * @apiName Log out 
 *
 * @apiGroup User
 *
 * @apiDescription This path log out the current user.
 *
 * @apiPermission Any
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