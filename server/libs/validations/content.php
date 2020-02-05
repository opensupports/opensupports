<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class Content extends AbstractRule {
    public function validate($content) {
        $content = str_replace(" ",'',preg_replace("/<\s*[^>]*>/",'',$content));
        
        if($content == '') return false;
        if(strlen($content) > 1250) return false;
        return true;
    }
}