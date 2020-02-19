<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/get-mail-template Get mail template
 * @apiVersion 4.6.1
 *
 * @apiName Get mail template
 *
 * @apiGroup System
 *
 * @apiDescription This path retrieves the data of one of the mail templates.
 *
 * @apiPermission staff3
 *
 * @apiParam {String} template The type of template to retrieve.
 * @apiParam {String} language The language of the template to retrieve.
 *
 * @apiUse NO_PERMISSION
 *
 * @apiSuccess {[MailTemplate](#api-Data_Structures-ObjectMailtemplate)} data Data of the mail template
 *
 */

class GetMailTemplateController extends Controller {
    const PATH = '/get-mail-template';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'template' => [
                    'validation' => DataValidator::notBlank()->length(4),
                    'error' => ERRORS::INVALID_TEMPLATE
                ],
                'language' => [
                    'validation' => DataValidator::notBlank()->length(2, 2),
                    'error' => ERRORS::INVALID_LANGUAGE
                ],
            ]
        ];
    }

    public function handler() {
        $type = Controller::request('template');
        $language = Controller::request('language');

        $mailTemplate = MailTemplate::findOne(' language = ? AND template = ?', [$language, $type]);

        if($mailTemplate->isNull()) {
            throw new RequestException(ERRORS::INVALID_TEMPLATE);
        }

        Response::respondSuccess($mailTemplate->toArray());
    }
}
