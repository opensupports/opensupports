<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidLanguage extends AbstractRule {

    public function validate($ticketNumber) {
        return in_array($ticketNumber, \Language::LANGUAGES);
    }
}