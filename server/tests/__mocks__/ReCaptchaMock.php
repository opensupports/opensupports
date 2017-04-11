<?php

namespace ReCaptcha {
    include_once 'tests/__lib__/Mock.php';

    class ReCaptcha extends \Mock {
        public static $functionList = array();
        public static $staticVerify;
        public $verify;

        public static function initVerify($value = true) {
            self::$staticVerify = \Mock::stub()->returns(new \Mock([
                'isSuccess' => \Mock::stub()->returns($value)
            ]));
        }

        public function __construct($privateKey) {
            parent::__construct();
            
            $this->privateKey = $privateKey;
            $this->verify = self::$staticVerify;
        }
    }
}