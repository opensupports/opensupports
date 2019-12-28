<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidPriorities extends AbstractRule {
    public function validate($priorities) {
    	$PriorityList = json_decode($priorities);

    	if(is_array($PriorityList)){
			foreach (array_unique($PriorityList) as $priorityId) {
				if($priorityId != 0 && $priorityId != 1 && $priorityId != 2) return false;
			}
	        return true;
    	}
    	return false;
    }
}
