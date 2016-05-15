<?php
class FileUploader {
    private static $instance = null;

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new FileUploader();
        }

        return self::$instance;
    }

    private function __construct() {}

    public function upload() {
        // TODO: Implement file upload features
    }
}