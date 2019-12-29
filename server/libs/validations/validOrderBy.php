<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidOrderBy extends AbstractRule {
    public function validate($orderBy) {
        if(is_object(json_decode($orderBy))){
        	$values =["closed","owner_id","unread_staff","priority","date"];

            $object = json_decode($orderBy);

        	if(($object->asc !== 1 && $object->asc !== 0) || !in_array($object->value, $values)) return false;

            return true;
        }
    }
}
