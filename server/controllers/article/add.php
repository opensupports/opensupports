<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /article/add Add article
 * @apiVersion 4.11.0
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
 * @apiUse INVALID_TITLE
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
                    'validation' => DataValidator::notBlank()->length(LengthConfig::MIN_LENGTH_TITLE, LengthConfig::MAX_LENGTH_TITLE),
                    'error' => ERRORS::INVALID_TITLE
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
            'title' => Controller::request('title', true),
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
