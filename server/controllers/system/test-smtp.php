<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/test-smtp Test SMTP Connection
 * @apiVersion 4.6.1
 *
 * @apiName Test SMTP Connection
 *
 * @apiGroup System
 *
 * @apiDescription Test if the given values connect correctly to a SMTP server.
 *
 * @apiPermission any
 *
 * @apiParam {String} smtp-host Host of the SMTP server.
 * @apiParam {String} smtp-port Port of the SMTP server.
 * @apiParam {String} smtp-user User for the SMTP server.
 * @apiParam {String} smtp-pass Password for the SMTP server.
 *
 * @apiUse SMTP_CONNECTION
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class TestSMTPController extends Controller {
    const PATH = '/test-smtp';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        $mailSender = MailSender::getInstance();
        $mailSender->setConnectionSettings(
            Controller::request('smtp-host'),
            Controller::request('smtp-user'),
            Controller::request('smtp-pass'),
            ''
        );

        if($mailSender->isConnected()) {
            Response::respondSuccess();
        } else {
            throw new RequestException(ERRORS::SMTP_CONNECTION);
        }
    }
}
