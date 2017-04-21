<?php

/**
 * @api {post} /user/check-session Check if session exist or not.
 *
 * @apiName Check session
 *
 * @apiGroup User
 *
 * @apiDescription This path give back a object that says if a session exist or not.
 *
 * @apiPermission Any
 *
 * @apiSuccess {Object} data
 *
 */

class CheckSessionController extends Controller {
    const PATH = '/check-session';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        $session = Session::getInstance();

        Response::respondSuccess([
            'sessionActive' => $session->sessionExists()
        ]);
    }
}
