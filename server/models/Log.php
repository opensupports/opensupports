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
            'authorUser' => (!$author->isNull() && !$author->staff) ? $author : null,
            'authorStaff' => (!$author->isNull() && $author->staff) ? $author : null,
            'to' => $to,
        ));
        $log->store();
    }
    public function toArray() {
        return [
            'type' => $this->type,
            'to' => $this->to,
            'author' => ($this->authorUser) ? $this->authorUser->toArray() : $this->authorStaff->toArray()
        ];
    }
}