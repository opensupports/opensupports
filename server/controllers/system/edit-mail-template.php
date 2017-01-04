<?php
use Respect\Validation\Validator as DataValidator;

class EditMailTemplateController extends Controller {
    const PATH = '/edit-mail-template';

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
        $subject = Controller::request('subject');
        $body = Controller::request('body');

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