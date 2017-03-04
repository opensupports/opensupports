<?php
class Date {
    public static function getCurrentDate() {
        return date('YmdHi');
    }

    public static function getPreviousDate() {
        return date('YmdHi', strtotime(' -1 day '));
    }
}
