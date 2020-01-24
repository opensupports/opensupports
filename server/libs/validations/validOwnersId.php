<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidOwnersId extends AbstractRule {

    public function validate($owners) {
    	if(is_array(json_decode($owners))){
			foreach (json_decode($owners) as $owner) {
                
                $author = \Ticket::getDataStore($owner, "owner_id");
				
				if($author->isNull()) return false; 
			}
	        return true;
	    }
	    return false;
    }
}