<?php

class Comment extends DataStore {
    const TABLE = 'comments';

    public static function getProps() {
        return array(
            'content',
            'file',
            'ticket',
            'author',
            'date'
        );
    }

    protected function getDefaultProps() {
        return array();
    }
}