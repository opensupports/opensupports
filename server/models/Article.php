<?php

class Article extends DataStore {
    const TABLE  = 'article';

    public function getProps() {
        return [
            'title',
            'content',
            'lastEdited',
            'position'
        ];
    }
}