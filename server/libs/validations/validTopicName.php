<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidTopicName extends AbstractRule {

    public function validate($name) {
        $topic = \Topic::getDataStore($name, 'name');
        return $topic->isNull();
   }
}
