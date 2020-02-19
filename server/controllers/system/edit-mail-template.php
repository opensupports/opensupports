<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/edit-mail-template Edit mail template
 * @apiVersion 4.6.1
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
 * @apiUse INVALID_TEXT_1
 * @apiUse INVALID_TEXT_2
 * @apiUse INVALID_TEXT_3
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class EditMailTemplateController extends Controller {
    const PATH = '/edit-mail-template';
    const METHOD = 'POST';

    private $language;
    private $templateType;
    private $subject;
    private $texts;

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'template' => [
                    'validation' => DataValidator::notBlank()->length(4),
                    'error' => ERRORS::INVALID_TEMPLATE
                ],
                'language' => [
                    'validation' => DataValidator::notBlank()->length(2,2),
                    'error' => ERRORS::INVALID_LANGUAGE
                ],
                'subject' => [
                    'validation' => DataValidator::notBlank()->length(4),
                    'error' => ERRORS::INVALID_SUBJECT
                ],
            ]
        ];
    }

    public function handler() {
        $this->language = Controller::request('language');
        $this->templateType = Controller::request('template');
        $this->subject = Controller::request('subject', true);
        $this->texts = [
            Controller::request('text1'),
            Controller::request('text2'),
            Controller::request('text3'),
        ];

        $mailTemplate = MailTemplate::findOne(' language = ? AND template = ?', [$this->language, $this->templateType]);

        if($mailTemplate->isNull()) {
            throw new RequestException(ERRORS::INVALID_TEMPLATE);
        }

        $this->validateReplacements();

        $mailTemplate->subject = $this->subject;
        $mailTemplate->text1 = $this->texts[0];
        $mailTemplate->text2 = $this->texts[1];
        $mailTemplate->text3 = $this->texts[2];

        $mailTemplate->store();

        Response::respondSuccess();
    }

    public function validateReplacements() {
        $originalText = MailTexts::getTexts()[$this->language][$this->templateType];

        if(array_key_exists(1, $originalText) && !$this->includes(
            $this->getReplacementStrings($originalText[1]),
            $this->getReplacementStrings($this->texts[0])
        )) {
            throw new RequestException(ERRORS::INVALID_TEXT_1);
        }

        if(array_key_exists(2, $originalText) && !$this->includes(
            $this->getReplacementStrings($originalText[2]),
            $this->getReplacementStrings($this->texts[1])
        )) {
            throw new RequestException(ERRORS::INVALID_TEXT_2);
        }

        if(array_key_exists(3, $originalText) && !$this->includes(
            $this->getReplacementStrings($originalText[3]),
            $this->getReplacementStrings($this->texts[2])
        )) {
            throw new RequestException(ERRORS::INVALID_TEXT_3);
        }
    }

    public function includes($array1, $array2) {
        foreach($array1 as $item) {
            if(!in_array($item, $array2)) return false;
        }

        return true;
    }

    public function getReplacementStrings($string) {
        $replacements = [];

        for($i=0; $i<strlen($string)-1; $i++) {
            if($string[$i] == '{' && $string[$i+1] == '{') {
                $replacement = "";
                $i += 2;
                for(; $i<strlen($string)-1;$i++) {
                    if($string[$i] == '}' && $string[$i+1] == '}') break;
                    $replacement .= $string[$i];
                }

                $replacements[] = $replacement;
            }
        }

        return $replacements;
    }
}
