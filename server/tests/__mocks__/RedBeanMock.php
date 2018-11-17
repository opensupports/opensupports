<?php

namespace RedBeanPHP {
    include_once 'tests/__mocks__/BeanMock.php';

    class Facade extends \Mock {
        public static $functionList = array();

        public static function initStubs() {
            self::setStatics(array(
                'trash' => parent::stub(),
                'store' => parent::stub(),
                'exec' => parent::stub(),
                'dispense' => parent::stub()->returns(new \BeanMock())
            ));
        }
    }
}
