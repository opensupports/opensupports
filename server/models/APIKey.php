<?php
/**
 * @api {OBJECT} APIKey APIKey
 * @apiVersion 4.4.0
 * @apiGroup Data Structures
 * @apiParam {String} name Name of the APIKey.
 * @apiParam {String} token Token of the APIKey.
 */

class APIKey extends DataStore {
    const TABLE  = 'apikey';

    public static function getProps() {
        return [
            'name',
            'token'
        ];
    }

    public function toArray() {
        return [
            'name' => $this->name,
            'token' => $this->token
        ];
    }
}