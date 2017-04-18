<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/get-mail-templates Get mail templates.
 *
 * @apiName Get mail templates
 *
 * @apiGroup system
 *
 * @apiDescription This path give back the all mail templates.
 *
 * @apiPermission Staff level 3
 *
 * @apiSuccess {Object} data
 *
 */

class GetMailTemplatesController extends Controller {
    const PATH = '/get-mail-templates';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }

    public function handler() {
        Response::respondSuccess(MailTemplate::getAll()->toArray());

    }
}