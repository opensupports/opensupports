<?php

class Hashing extends \Mock {
    public static $functionList = array();

    public static function initStubs() {
        self::setStatics(array(
            'hashPassword' => parent::stub()->returns('HASHED_PASSword'),
            'verifyPassword' => parent::stub()->returns(true),
            'generateRandomToken' => parent::stub()->returns('TEST_TOKEN')
        ));
    }
}
