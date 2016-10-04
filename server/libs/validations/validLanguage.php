<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidLanguage extends AbstractRule {

    //TODO: Use a list from database instead
    private $languages = [
        'en',
        'es',
        'de'
    ];
    
    public function validate($ticketNumber) {
        return in_array($ticketNumber, $this->languages);
    }
}