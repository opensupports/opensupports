<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidAuthorsBlackList extends AbstractRule {

    public function validate($blackList) {
    	if(is_array(json_decode($blackList))){
			foreach (json_decode($blackList) as $item) {
                if(!$item->id || !$item->staff) return false;
				if($item->staff != 0 && $item->staff != 1) return false;
                if(!is_numeric($item->id)) return false;
			}
	        return true;
	    }
	    return false;
    }
}