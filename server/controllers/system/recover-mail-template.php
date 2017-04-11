<?php
use Respect\Validation\Validator as DataValidator;

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