<?php
/**
 * @api {OBJECT} APIKey APIKey
 * @apiVersion 4.6.1
 * @apiGroup Data Structures
 * @apiParam {String} name Name of the APIKey.
 * @apiParam {String} token Token of the APIKey.
 */

class APIKey extends DataStore {
    const TABLE  = 'apikey';
    const REGISTRATION = 'REGISTRATION';
    const TICKET_CREATE = 'TICKET_CREATE';
    const TYPES = [APIKey::REGISTRATION, APIKey::TICKET_CREATE];

    public static function getProps() {
        return [
            'name',
            'token',
            'type'
        ];
    }

    public function getDefaultProps() {
        return [
            'type' => APIKey::REGISTRATION
        ];
    }

    public function toArray() {
        return [
            'name' => $this->name,
            'token' => $this->token,
            'type' => $this->type
        ];
    }
}