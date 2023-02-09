<?php

class Setting extends DataStore {
    const TABLE = 'setting';

    public static function getSetting($name) {
        return parent::getDataStore($name, 'name');
    }

    public static function getProps() {
        return array(
            'name',
            'value',
            'permission'
        );
    }

    public function getValue() {
        return $this->value;
    }
}