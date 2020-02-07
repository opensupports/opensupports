<?php

/**
 * @api {post} /user/check-session Check session
 * @apiVersion 4.6.1
 *
 * @apiName Check session
 *
 * @apiGroup User
 *
 * @apiDescription This path checks if the session exists.
 *
 * @apiPermission any
 *
 * @apiSuccess {Object} data Information about the session.
 * @apiSuccess {Boolean} data.sessionActive Indicates if the session is active.
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
