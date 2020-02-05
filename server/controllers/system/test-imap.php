<?php

/**
 * @api {post} /system/test-imap Test IMAP Connection
 * @apiVersion 4.6.1
 *
 * @apiName Test IMAP Connection
 *
 * @apiGroup System
 *
 * @apiDescription Test if the given values connect correctly to a IMAP server.
 *
 * @apiPermission any
 *
 * @apiParam {String} imap-host Host of the IMAP server.
 * @apiParam {String} imap-user User for the IMAP server.
 * @apiParam {String} imap-pass Password for the IMAP server.
 *
 * @apiUse IMAP_CONNECTION
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class TestIMAPController extends Controller {
    const PATH = '/test-imap';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        if(imap_open(Controller::request('imap-host'), Controller::request('imap-user'), Controller::request('imap-pass'))) {
            Response::respondSuccess();
        } else {
            throw new RequestException(ERRORS::IMAP_CONNECTION);
        }
    }
}
