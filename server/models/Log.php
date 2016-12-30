<?php
use RedBeanPHP\Facade as RedBean;

class Log extends DataStore {
    const TABLE = 'log';

    public static function getProps() {
        return [
            'type',
            'authorUser',
            'authorStaff',
            'to'
        ];
    }

    public static function createLog($type,$to, $author = null) {
        if($author === null) {
            $author = Controller::getLoggedUser();    
        } 
        $log =  new Log();

        $log->setProperties(array(
            'type' => $type,
            'to' => $to
        ));

        if($author instanceof User) {
            $log->authorUser = $author;
        } else {
            $log->authorStaff = $author;
        }

        $log->store();
    }

    public function toArray() {
        return [
            'type' => $this->type,
            'to' => $this->to,
            'author' => ($this->authorUser instanceof User) ? $this->authorUser->toArray() : $this->authorStaff->toArray()
        ];
    }
}