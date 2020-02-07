<?php
/**
 * @api {OBJECT} CustomResponse CustomResponse
 * @apiVersion 4.6.1
 * @apiGroup Data Structures
 * @apiParam {Number} id Id of the custom response.
 * @apiParam {String} content Content of the custom response.
 * @apiParam {String} name Name of the custom response.
 * @apiParam {String} language Language of the custom response.
 */

class CustomResponse extends DataStore {
    const TABLE = 'customresponse';
    
    public static function getProps() {
        return [
            'name',
            'language',
            'content'
        ];
    }

    public function toArray() {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'language' => $this->language,
            'content' => $this->content,
        ];
    }
}