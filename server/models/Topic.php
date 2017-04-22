<?php
/**
 * @api {OBJECT} Topic Topic
 * @apiGroup Data Structures
 * @apiParam {Number} id Id of the topic.
 * @apiParam {String} name Name of the topic.
 * @apiParam {String} icon Icon of the topic.
 * @apiParam {String} iconColor Icon's color of the topic.
 * @apiParam {[Article](#api-Data_Structures-ObjectArticle)[]} articles Articles of the Topic.
 */

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