<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidAuthorsBlackList extends AbstractRule {

    public function validate($blackList) {
    	if(is_array(json_decode($blackList))){
			foreach (json_decode($blackList) as $item) {
                if(!$item->id) return false;
				if($item->isStaff != 0 && $item->isStaff != 1) return false;
                if(!is_numeric($item->id)) return false;
			}
	        return true;
	    }
	    return false;
    }
}