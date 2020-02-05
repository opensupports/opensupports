<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /article/add Add article
 * @apiVersion 4.6.1
 *
 * @apiName Add article
 *
 * @apiGroup Article
 *
 * @apiDescription This path adds a new article.
 *
 * @apiPermission staff2
 *
 * @apiParam {String} title Title of the new article.
 * @apiParam {String} content Content of the new article.
 * @apiParam {Number} position Position of the new article.
 * @apiParam {Number} topicId Id of the articles's topic.
 * @apiParam {Number} images The number of images in the content
 * @apiParam image_i The image file of index `i` (mutiple params accepted)
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_NAME
 * @apiUse INVALID_CONTENT
 * @apiUse INVALID_TOPIC
 * @apiUse INVALID_FILE
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
                    'validation' => DataValidator::notBlank()->length(1, 100),
                    'error' => ERRORS::INVALID_NAME
                ],
                'content' => [
                    'validation' => DataValidator::content(),
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
        $content = Controller::request('content', true);

        $fileUploader = FileUploader::getInstance();
        $fileUploader->setPermission(FileManager::PERMISSION_ARTICLE);
        $imagePaths = $this->uploadImages(true);

        $article = new Article();
        $article->setProperties([
            'title' => Controller::request('title'),
            'content' => $this->replaceWithImagePaths($imagePaths, $content),
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
