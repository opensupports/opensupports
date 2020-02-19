<?php
/**
 * @api {OBJECT} Customfield Customfield
 * @apiVersion 4.6.1
 * @apiGroup Data Structures
 * @apiParam {Number} id Id of the custom filed.
 * @apiParam {String} name Name of the custom filed.
 * @apiParam {String} description Description of the custom field,
 * @apiParam {String} Type Type of custom field (select or text)
 * @apiParam {Customfieldoption[]} options List of possible values if it is select
 */

class Customfield extends DataStore {
    const TABLE = 'customfield';

    public static function getProps() {
        return [
            'name',
            'description',
            'type',
            'ownCustomfieldoptionList'
        ];
    }

    public function toArray() {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'type' => $this->type,
            'options'  => $this->ownCustomfieldoptionList->toArray()
        ];
    }
}
