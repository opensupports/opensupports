<?php
/**
 * @api {OBJECT} Customfieldoption Customfieldoption
 * @apiVersion 4.6.1
 * @apiGroup Data Structures
 * @apiParam {Number} id Id of the option.
 * @apiParam {String} name Name of the option.
 */

class Customfieldoption extends DataStore {
    const TABLE = 'customfieldoption';

    public static function getProps() {
        return [
            'name'
        ];
    }

    public function toArray() {
        return [
            'id' => $this->id,
            'name' => $this->name
        ];
    }
}
