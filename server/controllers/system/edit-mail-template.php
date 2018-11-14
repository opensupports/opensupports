<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/edit-mail-template Edit mail template
 * @apiVersion 4.3.0
 *
 * @apiName Edit mail template
 *
 * @apiGroup System
 *
 * @apiDescription This path edits a mail template.
 *
 * @apiPermission staff3
 *
 * @apiParam {String} template The template to edit.
 * @apiParam {String} language The language of the template to edit.
 * @apiParam {String} subject The new subject of the template.
 * @apiParam {String} text1 The first paragraph template.
 * @apiParam {String} text2 The second paragraph template.
 * @apiParam {String} text3 The third paragraph template.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TEMPLATE
 * @apiUse INVALID_LANGUAGE
 * @apiUse INVALID_SUBJECT
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class EditMailTemplateController extends Controller {
    const PATH = '/edit-mail-template';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'template' => [
                    'validation' => DataValidator::length(4),
                    'error' => ERRORS::INVALID_TEMPLATE
                ],
                'language' => [
                    'validation' => DataValidator::length(2, 2),
                    'error' => ERRORS::INVALID_LANGUAGE
                ],
                'subject' => [
                    'validation' => DataValidator::length(4),
                    'error' => ERRORS::INVALID_SUBJECT
                ],
            ]
        ];
    }

    public function handler() {
        $language = Controller::request('language');
        $templateType = Controller::request('template');
        $subject = Controller::request('subject', true);
        $texts = [
            Controller::request('text1'),
            Controller::request('text2'),
            Controller::request('text3'),
        ];

        $mailTemplate = MailTemplate::findOne(' language = ? AND template = ?', [$language, $templateType]);
        if($mailTemplate->isNull()) {
            throw new Exception(ERRORS::INVALID_TEMPLATE);
        }
        $mailTemplate->subject = $subject;
        $mailTemplate->text1 = $texts[0];
        $mailTemplate->text2 = $texts[1];
        $mailTemplate->text3 = $texts[2];
        $mailTemplate->store();

        Response::respondSuccess();
    }
}
