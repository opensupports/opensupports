<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/recover-mail-template Recover mail template
 * @apiVersion 4.2.0
 *
 * @apiName Recover mail template
 *
 * @apiGroup System
 *
 * @apiDescription This path recovers an mail template to its original content.
 *
 * @apiPermission staff3
 *
 * @apiParam {String} templateType Type of the template.
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
                'templateType' => [
                    'validation' => DataValidator::length(4),
                    'error' => ERRORS::INVALID_TEMPLATE
                ],
                'language' => [
                    'validation' => DataValidator::length(2, 2),
                    'error' => ERRORS::INVALID_LANGUAGE
                ],
            ]
        ];
    }

    public function handler() {
        $type = Controller::request('templateType');
        $language = Controller::request('language');

        $mailTemplate = MailTemplate::findOne(' language = ? AND type = ?', [$language, $type]);

        if($mailTemplate->isNull()) {
            Response::respondError(ERRORS::INVALID_TEMPLATE);
            return;
        }
        $defaultTemplates = InitialMails::retrieve();

        $mailTemplate->body = $defaultTemplates[$type][$language]['body'] ;
        $mailTemplate->subject = $defaultTemplates[$type][$language]['subject'] ;

        $mailTemplate->store();
        
        Response::respondSuccess();

    }
}