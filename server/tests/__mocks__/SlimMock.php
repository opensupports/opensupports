<?php
namespace Slim {
    class Response extends \Mock {
        protected static $instance;

        public function __construct() {}

        public static function getInstance() {
            if (self::$instance === null) {
                self::$instance = new \Mock();
                self::$instance->setBody = \Mock::stub();
                self::$instance->setStatus = \Mock::stub();
                self::$instance->finalize = \Mock::stub();
                self::$instance->headers = new \Mock();
                self::$instance->headers->set = \Mock::stub();
            }

            return self::$instance;
        }
    }

    class Slim extends \Mock {
        protected static $instance;
        public static $functionList = [];

        public function __construct() {
        }

        public static function getInstance() {
            if (self::$instance === null) {
                self::$instance = new Slim();
                self::$instance->response = Response::getInstance();
            }

            return self::$instance;
        }
    }
}
