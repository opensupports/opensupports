<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidDateRange extends AbstractRule {

    public function validate($dateRange) {
    	$dateArray = json_decode($dateRange);
    	$counter = 0;
    	if(is_array($dateArray)){	
			foreach ($dateArray as $date) {
				if (is_numeric($date)) $counter++;
			}

			return ((sizeof($dateArray) == 2  && $counter == 2) || sizeof($dateArray) == 0 );
    	}
    	return false;
    }
}