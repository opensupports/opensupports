<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidLanguage extends AbstractRule {

    private $languages = [
        'en',
        'es',
        'de',
        'cn',
    ];
    
    public function validate($ticketNumber) {
        return in_array($ticketNumber, $this->languages);
    }
}