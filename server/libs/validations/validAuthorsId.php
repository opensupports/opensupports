<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidAuthorsId extends AbstractRule {

    public function validate($authors) {
    	if(is_array(json_decode($authors))){
			foreach (json_decode($authors) as $authorObject) {
				if($authorObject->staff){
					$author = \Staff::getDataStore($authorObject->id);
				}else{
					$author = \User::getDataStore($authorObject->id);
				}
				if($author->isNull()) return false; 
			}
	        return true;
	    }
	    return false;
    }
}