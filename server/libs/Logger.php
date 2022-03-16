<?php

class Logger {
    public static function debug($data) {
        error_log(print_r($data, true), 3, "/var/tmp/debug.log");
    }
}
