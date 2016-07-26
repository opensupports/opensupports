<?php

class Comment extends DataStore {
    const TABLE = 'comment';

    public static function getProps() {
        return array(
            'content',
            'file',
            'ticket',
            'author',
            'date'
        );
    }
}