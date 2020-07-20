<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidUsersId extends AbstractRule {
    public function validate($userIdList) {
    	if(is_array(json_decode($userIdList))){
			foreach (json_decode($userIdList) as $userItem) {
				$author = \User::getDataStore($userItem);
				if($author->isNull()) return false; 
			}
	        return true;
	    }
	    return false;
    }
}