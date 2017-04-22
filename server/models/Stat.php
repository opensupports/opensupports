<?php
/**
 * @api {OBJECT} Stat Stat
 * @apiGroup Data Structures
 * @apiParam {Number} date The date of the stat.
 * @apiParam {String} type The type of the stat.
 * @apiParam {Boolean} general The general of the stat.
 * @apiParam {String} value The value of the stat.
 */

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
    public function toArray() {
        return [
            'date' => $this->date,
            'type' => $this->type,
            'general' => $this->general,
            'value' => $this->value
        ];
    }
}