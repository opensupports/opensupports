<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidOrderBy extends AbstractRule {
    public function validate($orderBy) {
        if(is_object(json_decode($orderBy))){
        	$values =["closed","owner_id","unread_staff","priority","date"];
        	$isTrue = false;
            $object = json_decode($orderBy);

        	if($object->asc !== 1 && $object->asc !== 0) return false;

        	foreach ($values as $value) {
        	 	if($object->value == $value) $isTrue = true;
        	}
            return $isTrue;
        }
    }
}
