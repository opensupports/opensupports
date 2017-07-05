<?php

class NullDataStore extends DataStore {
    const TABLE = null;

    public function __construct() {
        $this->_bean = null;
    }

    public function isNull() {
        return true;
    }

    public function getProps() {
        return [];
    }

    public function store() {
        return null;
    }

    public function getValue() {
        return null;
    }
}