<?php
namespace Slim {
    class Response extends \Mock {
        protected static $instance;

        public function __construct() {}

        public static function getInstance() {
            if (self::$instance === null) {
                self::$instance = new \Mock();
                self::$instance->setBody = \Mock::stub();
                self::$instance->finalize = \Mock::stub();
            }

            return self::$instance;
        }
    }

    class Slim extends \Mock {
        protected static $instance;

        public function __construct() {
        }

        public static function getInstance() {
            if (self::$instance === null) {
                self::$instance = new Slim();
                self::$instance->response = \Mock::stub()->returns(Response::getInstance());
            }

            return self::$instance;
        }
    }
}