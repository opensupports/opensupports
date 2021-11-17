<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidOptions extends AbstractRule {

    public function validate($options) {
        if(is_array(json_decode($options))) {
            $arrayOptions = json_decode($options);

            if(2 <= (sizeof($arrayOptions))) {
                foreach($arrayOptions as $option) {
                    if(!$option && $option != '0' || empty(trim($option))) {
                        return false;
                    }
                }

                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
