<?php

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