<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /article/edit-topic Edit a topic.
 *
 * @apiName Edit topic
 *
 * @apiGroup article
 *
 * @apiDescription This path edits a topic.
 *
 * @apiPermission Staff level 2
 *
 * @apiParam {Number} topicId Id of the topic.
 * @apiParam {String} name The new name of the topic.
 * @apiParam {String} icon The new icon of the topic.
 * @apiParam {String} iconColor The new Icon's color of the topic.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TOPIC
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class EditTopicController extends Controller {
    const PATH = '/edit-topic';
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

        if(Controller::request('name')) {
            $topic->name = Controller::request('name');
        }

        if(Controller::request('iconColor')) {
            $topic->iconColor = Controller::request('iconColor');
        }

        if(Controller::request('icon')) {
            $topic->icon = Controller::request('icon');
        }

        $topic->store();
        Response::respondSuccess();
    }
}