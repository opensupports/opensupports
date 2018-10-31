<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/get-mail-templates Get mail templates
 * @apiVersion 4.3.0
 *
 * @apiName Get mail templates
 *
 * @apiGroup System
 *
 * @apiDescription This path retrieves the all the mail templates.
 *
 * @apiPermission staff3
 *
 * @apiUse NO_PERMISSION
 * 
 * @apiSuccess {[MailTemplate](#api-Data_Structures-ObjectMailtemplate)[]} data Array of mail templates
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