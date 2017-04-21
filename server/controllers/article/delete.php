<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /article/delete Delete a article.
 *
 * @apiName Delete
 *
 * @apiGroup article
 *
 * @apiDescription This path deletes a article.
 *
 * @apiPermission Staff level 2
 *
 * @apiParam {Number} articleId Id of the article.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TOPIC
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class DeleteArticleController extends Controller {
    const PATH = '/delete';
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
        Log::createLog('DELETE_ARTICLE', $article->title);

        $article->delete();

        Response::respondSuccess();
    }
}