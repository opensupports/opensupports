<?php

class Topic extends DataStore {
    const TABLE = 'topic';

    public static function getProps() {
        return [
            'name',
            'icon',
            'iconColor',
            'ownArticleList'
        ];
    }

    public function toArray() {
        $articlesArray = [];

        foreach($this->ownArticleList as $article) {
            $articlesArray[] = $article->toArray();
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'icon' => $this->icon,
            'iconColor' => $this->iconColor,
            'articles' => $articlesArray
        ];
    }
}