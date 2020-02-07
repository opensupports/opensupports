<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/recover-mail-template Recover mail template
 * @apiVersion 4.6.1
 *
 * @apiName Recover mail template
 *
 * @apiGroup System
 *
 * @apiDescription This path recovers an mail template to its original content.
 *
 * @apiPermission staff3
 *
 * @apiParam {String} template Type of the template.
 * @apiParam {String} language Lenguage of the template.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TEMPLATE
 * @apiUse INVALID_LANGUAGE
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class RecoverMailTemplateController extends Controller {
    const PATH = '/recover-mail-template';
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
        $templateType = Controller::request('template');
        $language = Controller::request('language');

        $mailTemplate = MailTemplate::findOne(' language = ? AND template = ?', [$language, $templateType]);

        if($mailTemplate->isNull()) {
            throw new RequestException(ERRORS::INVALID_TEMPLATE);
        }

        $mailTexts = MailTexts::getTexts()[$language][$templateType];

        $mailTemplate->subject = $mailTexts[0];
        $mailTemplate->text1 = (array_key_exists(1, $mailTexts)) ? $mailTexts[1] : '';
        $mailTemplate->text2 = (array_key_exists(2, $mailTexts)) ? $mailTexts[2] : '';
        $mailTemplate->text3 = (array_key_exists(3, $mailTexts)) ? $mailTexts[3] : '';

        $mailTemplate->store();

        Response::respondSuccess();
    }
}
