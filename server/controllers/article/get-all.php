<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /article/get-all Get all articles
 * @apiVersion 4.6.1
 *
 * @apiName Get all articles
 *
 * @apiGroup Article
 *
 * @apiDescription This path retrieves all the articles.
 *
 * @apiPermission any or user
 *
 * @apiUse NO_PERMISSION
 *
 * @apiSuccess {[Topic](#api-Data_Structures-ObjectTopic)[]} data Array of topics.
 */

class GetAllArticlesController extends Controller {
    const PATH = '/get-all';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => (Controller::isUserSystemEnabled()) ? 'user' : 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        $topics = Topic::getAll();
        $topicsArray = [];

        foreach($topics as $topic) {
            if (Controller::isStaffLogged()) {
                $topicsArray[] = $topic->toArray();
            } else if (!$topic->private) {
                $topicsArray[] = $topic->toArray();
            }
        }

        Response::respondSuccess($topicsArray);
    }
}
