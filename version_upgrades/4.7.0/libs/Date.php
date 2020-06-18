<?php
class Date {
    public static function getCurrentDate() {
        return date('YmdHi');
    }

    public static function getPreviousDate($days = 1) {
        return date('YmdHi', strtotime(" -$days day "));
    }

    public static function getNextDate($days = 1) {
        return date('YmdHi', strtotime(" +$days day "));
    }
}
