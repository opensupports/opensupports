<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class validSupervisedUsers extends AbstractRule {
    public function validate($authors) {
    	if(is_array(json_decode($authors))){
			foreach (json_decode($authors) as $authorItem) {
				$author = \User::getDataStore($authorItem);
				if($author->isNull()) return false; 
			}
	        return true;
	    }
	    return false;
    }
}