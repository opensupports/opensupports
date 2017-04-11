<?php

class Controller extends \Mock {
    public static $functionList = array();

    public static function initStubs() {
        parent::setStatics(array(
            'request' => parent::stub()->returns('mockRequestValue'),
            'checkUserLogged' => parent::stub()->returns(true)
        ));
    }
}