<?php
/**
 * @api {OBJECT} Article Article
 * @apiGroup Data Structures
 * @apiParam {Email} email Email of the user banned.
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