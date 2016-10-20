<?php
use RedBeanPHP\Facade as RedBean;

class Department extends DataStore {
    const TABLE = 'department';
    
    public static function getProps() {
        return [
            'name',
            'sharedTicketList'
        ];
    }

    public static function getDepartmentNames() {
        $departmentsList = RedBean::findAll(Department::TABLE);
        $departmentsNameList = [];

        foreach($departmentsList as $department) {
            $departmentsNameList[] = $department->name;
        }
        
        return $departmentsNameList;
    }
}