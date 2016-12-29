<?php
use RedBeanPHP\Facade as RedBean;

class Log extends DataStore {
    const TABLE = 'log';

    public static function getProps() {
        return [
            'type',
            'author',
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
            'author' => (!$author->isNull() && !$author->staff) ? $author : null,
            'authorStaff' => (!$author->isNull() && $author->staff) ? $author : null,
            'to' => $to,
        ));
        $log->store();
    }
}