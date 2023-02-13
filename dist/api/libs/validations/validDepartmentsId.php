<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidDepartmentsId extends AbstractRule {

    public function validate($departments) {
    	$DepartmentsList = json_decode($departments);
    	if(is_array($DepartmentsList)){
			foreach ($DepartmentsList as $departmentsId) {
				$department = \Department::getDataStore($departmentsId);
				if($department->isNull()) return false; 
			}
	        return true;
    	}
    	return false;
    }
}
