<?php
use RedBeanPHP\Facade as RedBean;

/**
 * @api {OBJECT} Department Department
 * @apiVersion 4.2.0
 * @apiGroup Data Structures
 * @apiParam {Number} id Id of the department.
 * @apiParam {String} name Name of the department.
 * @apiParam {[Staff](#api-Data_Structures-ObjectStaff)[]} owners List of owners of the department.
 */

class Department extends DataStore {
    const TABLE = 'department';
    
    public static function getProps() {
        return [
            'name',
            'sharedTicketList',
            'owners'
        ];
    }
    
    public function getDefaultProps() {
        return [
            'owners' => 0 
        ];
    }

    public static function getDepartmentNames() {
        $departmentsList = RedBean::findAll(Department::TABLE);
        $departmentsNameList = [];

        foreach($departmentsList as $department) {
            $departmentsNameList[] = [
                'id' => $department->id,
                'name' => $department->name,
                'owners' => $department->owners
            ];
        }
        
        return $departmentsNameList;
    }
    public function toArray() {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'owners' => $this->owners
        ];
    }
}