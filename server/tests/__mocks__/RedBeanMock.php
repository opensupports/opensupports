<?php
namespace RedBeanPHP {
    class Facade extends \Mock {
        private static $functionList = array();

        public static function initStubs(){
            self::$functionList = array(
                'trash' => parent::stub(),
                'store' => parent::stub(),
                'dispense' => parent::stub()->returns(array())
            );
        }

        public static function setStatics($statics) {
            foreach ($statics as $key => $static) {
                self::$functionList[$key] = $static;
            }
        }

        public static function __callStatic($key, $arguments) {
            if (self::$functionList[$key]) {
                $function =  self::$functionList[$key];

                return $function($arguments);
            }
        }

        public static function get($key) {
            return self::$functionList[$key];
        }
    }
}
