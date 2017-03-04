<?php
class Date {
    public static function setTimeZone() {
        $timezone = Setting::getSetting('time-zone');

        if(!$timezone->isNull()) {
            $timezone = $timezone->getValue();

            if($timezone > 0) {
                date_default_timezone_set('GMT+' . $timezone);
            } else if($timezone == 0) {
                date_default_timezone_set('GMT');
            } else {
                date_default_timezone_set('GMT-' . abs($timezone * 1));
            }
        }
    }

    public static function getCurrentDate() {
        return date('YmdHi');
    }

    public static function getPreviousDate() {
        return date('YmdHi', strtotime(' -1 day '));
    }
}
