<?php
/**
 * @api {OBJECT} Article Article
 * @apiVersion 4.6.1
 * @apiGroup Data Structures
 * @apiParam {Number} id Id of the article.
 * @apiParam {String} title Title of the article.
 * @apiParam {String} content Content of the article.
 * @apiParam {Number} lastEdited Last edit of the article.
 * @apiParam {Number} position Position of the article.
 */

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