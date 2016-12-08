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
            $departmentsNameList[] = [
                'id' => $department->id,
                'name' => $department->name
            ];
        }
        
        return $departmentsNameList;
    }
    public function toArray() {
        return [
            'id' => $this->id,
            'name' => $this->name
        ];
    }
}