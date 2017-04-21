<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/edit-mail-template Edit a mail template.
 *
 * @apiName Edit mail template
 *
 * @apiGroup system
 *
 * @apiDescription This path edit a mail template.
 *
 * @apiPermission Staff level 3
 *
 * @apiParam {String} templateType The new type of the template.
 * @apiParam {String} language The new language of the template.
 * @apiParam {String} subject The new subject of the template.
 * @apiParam {String} body The new content of the template.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TEMPLATE
 * @apiUse INVALID_LANGUAGE
 * @apiUse INVALID_SUBJECT
 * @apiUse INVALID_BODY
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
                'templateType' => [
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
                'body' => [
                    'validation' => DataValidator::length(4),
                    'error' => ERRORS::INVALID_BODY
                ]
            ]
        ];
    }

    public function handler() {
        $language = Controller::request('language');
        $templateType = Controller::request('templateType');
        $subject = Controller::request('subject', true);
        $body = Controller::request('body', true);

        $mailTemplate = MailTemplate::findOne(' language = ? AND type = ?', [$language, $templateType]);
        if($mailTemplate->isNull()) {
            Response::respondError(ERRORS::INVALID_TEMPLATE);
            return;
        }
        $mailTemplate->subject = $subject;
        $mailTemplate->body = $body;
        $mailTemplate->store();

        Response::respondSuccess();

    }
}