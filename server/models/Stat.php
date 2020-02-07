<?php
/**
 * @api {OBJECT} Stat Stat
 * @apiVersion 4.6.1
 * @apiGroup Data Structures
 * @apiParam {Number} date The date of the stat as a number in format YYYYMMDD.
 * @apiParam {String} type The type of the stat. It can be CREATE_TICKET, CLOSE, SIGNUP, COMMENT, ASSIGN or UNASSIGN
 * @apiParam {Boolean} general Indicates if the stat is from the general system or from a particular ticket.
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