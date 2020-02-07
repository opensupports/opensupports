<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /article/delete-topic Delete topic
 * @apiVersion 4.6.1
 *
 * @apiName Delete topic
 *
 * @apiGroup Article
 *
 * @apiDescription This path deletes a topic.
 *
 * @apiPermission staff2
 *
 * @apiParam {Number} topicId Id of the topic.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TOPIC
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class DeleteTopicController extends Controller {
    const PATH = '/delete-topic';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_2',
            'requestData' => [
                'topicId' => [
                    'validation' => DataValidator::dataStoreId('topic'),
                    'error' => ERRORS::INVALID_TOPIC
                ]
            ]
        ];
    }

    public function handler() {
        $topic = Topic::getDataStore(Controller::request('topicId'));
        
        Log::createLog('DELETE_TOPIC', $topic->name);

        $topic->delete();
        Response::respondSuccess();
    }
}