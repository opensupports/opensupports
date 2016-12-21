<?php
use RedBeanPHP\Facade as RedBean;

class Language extends DataStore {
    const TABLE = 'language';
    const LANGUAGES = [
        'en',
        'es',
        'de',
        'fr',
        'pr',
        'jp',
        'ru',
        'cn',
        'in',
        'tr'
    ];
    
    public static function getProps() {
        return [
            'code',
            'allowed',
            'supported'
        ];
    }

    
}