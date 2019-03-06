<?php
use RedBeanPHP\Facade as RedBean;
/**
 * @api {OBJECT} Log Log
 * @apiVersion 4.4.0
 * @apiGroup Data Structures
 * @apiParam {String} type The type of the log.
 * @apiParam {String} to Object where the action was performed.
 * @apiParam {Object} author Author of the log.
 * @apiParam {String} author.name Name of the author.
 * @apiParam {Number} author.id Id of the author.
 * @apiParam {Boolean} author.staff Indicates if the author is a staff.
 * @apiParam {String} date Date of the log creation.
 */

class Log extends DataStore {
    const TABLE = 'log';

    public static function getProps() {
        return [
            'type',
            'authorUser',
            'authorStaff',
            'to',
            'date'
        ];
    }

    public static function createLog($type,$to, $author = null) {
        if($author === null) {
            $author = Controller::getLoggedUser();    
        } 
        
        $log = new Log();

        $log->setProperties(array(
            'type' => $type,
            'to' => $to,
            'date' => Date::getCurrentDate()
        ));

        if($author instanceof User) {
            $log->authorUser = $author;
        } else {
            $log->authorStaff = $author;
        }

        $log->store();
    }

    public function toArray() {
        $author = ($this->authorUser instanceof User) ? $this->authorUser : $this->authorStaff;
        
        return [
            'type' => $this->type,
            'to' => $this->to,
            'author' => [
                'name' => $author->name,
                'id' => $author->id,
                'staff' => $author instanceof Staff
            ],
            'date' => $this->date 
        ];
    }
}