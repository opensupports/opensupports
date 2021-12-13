<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidArticleContent extends AbstractRule {

    public function validate($content) {
        $article = \Article::getDataStore($content, 'content');
        return $article->isNull();
   }
}
