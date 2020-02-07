<?php
/**
 * @api {OBJECT} Customfieldvalue Customfieldvalue
 * @apiVersion 4.6.1
 * @apiGroup Data Structures
 * @apiParam {Number} id Id of the value.
 * @apiParam {Customfield} customfield Customfield of the value.
 * @apiParam {String} value Content of the value..
 */

class Customfieldvalue extends DataStore {
    const TABLE = 'customfieldvalue';

    public static function getProps() {
        return [
            'customfield',
            'value',
            'customfieldoption'
        ];
    }

    public function toArray() {
        return [
            'id' => $this->id,
            'customfield' => $this->customfield->name,
            'value' => $this->value,
            'customfieldoption' => $this->customfieldoption ? $this->customfieldoption->toArray() : null,
        ];
    }
}
