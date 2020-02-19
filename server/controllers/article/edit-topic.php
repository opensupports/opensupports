<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /article/edit-topic Edit topic
 * @apiVersion 4.6.1
 *
 * @apiName Edit topic
 *
 * @apiGroup Article
 *
 * @apiDescription This path edits a topic.
 *
 * @apiPermission staff2
 *
 * @apiParam {Number} topicId Id of the topic.
 * @apiParam {String} name The new name of the topic. Optional.
 * @apiParam {String} icon The new icon of the topic. Optional.
 * @apiParam {String} iconColor The new Icon's color of the topic. Optional.
 * @apiParam {Boolean} private Indicates if the topic is not shown to users.
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
                ],
                'name' => [
                    'validation' => DataValidator::notBlank()->length(1, 200),
                    'error' => ERRORS::INVALID_NAME
                ],
                
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
        if (Controller::request('private') !== null) {
            $topic->private = Controller::request('private');
        }

        $topic->store();
        Response::respondSuccess();
    }
}
