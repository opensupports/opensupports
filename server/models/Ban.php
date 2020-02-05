<?php
/**
 * @api {OBJECT} Ban Ban
 * @apiVersion 4.6.1
 * @apiGroup Data Structures
 * @apiParam {Email} email The email address that is banned.
 */

class Ban extends DataStore {
    const TABLE = 'ban';

    public static function getProps() {
        return array (
          'email'
        );
    }

    public function getDefaultProps() {
        return array();
    }
    public function toArray() {
        return $this->email;
    }
}