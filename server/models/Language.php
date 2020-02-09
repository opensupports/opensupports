<?php
use RedBeanPHP\Facade as RedBean;

class Language extends DataStore {
    const TABLE = 'language';
    const LANGUAGES = [
        'en',
        'es',
        'de',
        'fr',
        'pt',
        'jp',
        'ru',
        'cn',
        'in',
        'tr',
        'it',
        'br',
        'gr',
        'nl',
        'pl'
    ];

    public static function getProps() {
        return [
            'code',
            'allowed',
            'supported'
        ];
    }

    public static function getSupportedLanguages() {
        $array = [];
        foreach(Language::LANGUAGES as $languageCode) {
            if (self::getDataStore($languageCode,'code')->supported) {
                array_push($array, $languageCode);
            }
        }
        return $array;
    }
    public static function getAllowedLanguages() {
        $array = [];
        foreach(Language::LANGUAGES as $languageCode) {
            if (self::getDataStore($languageCode,'code')->allowed) {
                array_push($array, $languageCode);
            }
        }
        return $array;
    }
}
