<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidTagsId extends AbstractRule {

    public function validate($tags) {
    	$listTags = json_decode($tags);
    	if(is_array($listTags)){
			foreach ($listTags as $TagId) {
				$tag = \Tag::getDataStore($TagId);
				if($tag->isNull()) return false; 
			}
			return true;
		}
        return false;
    }
}