<?php

class Topic extends DataStore {
    const TABLE = 'topic';

    public function getProps() {
        return [
            'name',
            'icon',
            'iconColor',
            'ownArticleList'
        ];
    }
}