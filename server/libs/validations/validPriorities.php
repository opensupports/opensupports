<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidPriorities extends AbstractRule {
    public function validate($prioritys) {
    	$PriorityList = json_decode($prioritys);

    	if(is_array($PriorityList)){
			foreach (array_unique($PriorityList) as $priorityId) {
				if($priorityId != 0 && $priorityId != 1 && $priorityId != 2) return false;
			}
	        return true;
    	}
    	return false;
    }
}
