<?php

class Setting extends DataStore {
    const TABLE = 'setting';

    public static function getSetting($name) {
        $dataStore = parent::getDataStore($name, 'name');

        return ($dataStore !== null) ? $dataStore->value : null;
    }

    public static function getProps() {
        return array(
            'name',
            'value',
            'permission'
        );
    }
}