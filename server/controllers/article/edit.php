<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /article/edit Edit a article.
 *
 * @apiName Edit a article
 *
 * @apiGroup article
 *
 * @apiDescription This path edits a article.
 *
 * @apiPermission Staff level 2
 *
 * @apiParam {Number} articleId Id of the article.
 * @apiParam {Number} topicId Id of the topic of the article.
 * @apiParam {String} content The new content of the article.
 * @apiParam {String} title The new title of the article.
 * @apiParam {Number} position The new position of the article.
 * 
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TOPIC
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class EditArticleController extends Controller {
    const PATH = '/edit';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_2',
            'requestData' => [
                'articleId' => [
                    'validation' => DataValidator::dataStoreId('article'),
                    'error' => ERRORS::INVALID_TOPIC
                ]
            ]
        ];
    }

    public function handler() {
        $article = Article::getDataStore(Controller::request('articleId'));

        if (Controller::request('topicId')) {
            $newArticleTopic = Topic::getDataStore(Controller::request('topicId'));

            if (!$newArticleTopic->isNull()) {
                $article->topic = $newArticleTopic;
            } else {
                Response::respondError(ERRORS::INVALID_TOPIC);
                return;
            }
        }

        if(Controller::request('content')) {
            $article->content = Controller::request('content', true);
        }

        if(Controller::request('title')) {
            $article->title = Controller::request('title');
        }

        if(Controller::request('position')) {
            $article->position = Controller::request('position');
        }

        $article->lastEdited = Date::getCurrentDate();

        $article->store();

        Log::createLog('EDIT_ARTICLE', $article->title);

        Response::respondSuccess();
    }
}