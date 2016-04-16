<?php
namespace RedBeanPHP {
    class Facade extends \Mock {
        public static $functionList = array();

        public static function initStubs() {
            self::setStatics(array(
                'trash' => parent::stub(),
                'store' => parent::stub(),
                'dispense' => parent::stub()->returns(array())
            ));
        }
    }
}
