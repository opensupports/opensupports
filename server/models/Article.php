<?php

class Article extends DataStore {
    const TABLE  = 'article';

    public static function getProps() {
        return [
            'title',
            'content',
            'lastEdited',
            'topic',
            'position'
        ];
    }
    
    public function toArray() {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'lastEdited' => $this->lastEdited,
            'position' => $this->position
        ];
    }
}