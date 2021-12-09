<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidArticleName extends AbstractRule {

    public function validate($name) {
        $article = \Article::getDataStore($name, 'title');
        return $article->isNull();
   }
}
