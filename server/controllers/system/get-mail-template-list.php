<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/get-mail-template-list Get mail template
 * @apiVersion 4.6.1
 *
 * @apiName Get mail template list
 *
 * @apiGroup System
 *
 * @apiDescription This path retrieves the list of mail templates
 *
 * @apiPermission staff3
 *
 * @apiUse NO_PERMISSION
 *
 * @apiSuccess {[MailTemplate](#api-Data_Structures-ObjectMailtemplate)[]} data Array of mail templates
 *
 */

class GetMailTemplateListController extends Controller {
    const PATH = '/get-mail-template-list';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }

    public function handler() {
        Response::respondSuccess(array_keys(MailTemplate::getFilePaths()));
    }
}
