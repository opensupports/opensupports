<?php
class Stat extends DataStore {
    const TABLE = 'stat';

    public static function getProps() {
        return array (
            'date',
            'type',
            'general',
            'value'
        );
    }

    public function getDefaultProps() {
        return array();
    }
}