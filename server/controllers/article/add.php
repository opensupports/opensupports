<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /article/add Add a article.
 *
 * @apiName Add
 *
 * @apiGroup article
 *
 * @apiDescription This path adds a new article.
 *
 * @apiPermission Staff level 2
 *
 * @apiParam {String} title Title of the new article.
 * @apiParam {String} content Content of the new article.
 * @apiParam {Number} position Position of the new article.
 * @apiParam {Number} topicId Id of the articles's topic.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_NAME
 * @apiUse INVALID_CONTENT
 * @apiUse INVALID_TOPIC
 *
 * @apiSuccess {Object} data Article info
 * @apiSuccess {Number} data.articleId Article id
 */

class AddArticleController extends Controller {
    const PATH = '/add';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_2',
            'requestData' => [
                'title' => [
                    'validation' => DataValidator::length(3, 100),
                    'error' => ERRORS::INVALID_NAME
                ],
                'content' => [
                    'validation' => DataValidator::length(10),
                    'error' => ERRORS::INVALID_CONTENT
                ],
                'topicId' => [
                    'validation' => DataValidator::dataStoreId('topic'),
                    'error' => ERRORS::INVALID_TOPIC
                ]
            ]
        ];
    }

    public function handler() {
        $article = new Article();
        $article->setProperties([
            'title' => Controller::request('title'),
            'content' => Controller::request('content', true),
            'lastEdited' => Date::getCurrentDate(),
            'position' => Controller::request('position') || 1
        ]);

        $topic = Topic::getDataStore(Controller::request('topicId'));
        $topic->ownArticleList->add($article);
        $topic->store();

        Log::createLog('ADD_ARTICLE', $article->title);

        Response::respondSuccess([
            'articleId' => $article->store()
        ]);
    }
}