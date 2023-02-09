<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidDateRange extends AbstractRule {

    public function validate($dateRange) {
        $dateArray = json_decode($dateRange);
        
        if(is_array($dateArray) && count($dateArray) == 2  ){
            foreach ($dateArray as $date) {
                if (!is_numeric($date)) return false;
            }
            return $dateArray[0] <= $dateArray[1];
        }
        return false;
   }
}
