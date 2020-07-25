<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidAuthorsList extends AbstractRule {

    public function validate($authors) {
    	if(is_array(json_decode($authors))){
			foreach (json_decode($authors) as $author) {
                if(!$author->id) return false;
				if($author->isStaff != 0 && $author->isStaff != 1) return false;
                if(!is_numeric($author->id)) return false;
                $item = [];
                if($author->isStaff){
                    $item = \Staff::getDataStore($author->id);
                }else{
                    $item = \User::getDataStore($author->id);
                }
                if($item->isNull()) return false;
			}
	        return true;
	    }
	    return false;
    }
}