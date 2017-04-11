<?php

class Response extends \Mock {
    public static $functionList = array();

    public static function initStubs() {
        parent::setStatics(array(
            'respondSuccess' => parent::stub(),
            'respondError' => parent::stub()
        ));
    }
}