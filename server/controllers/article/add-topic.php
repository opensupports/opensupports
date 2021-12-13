<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /article/add-topic Add topic
 * @apiVersion 4.10.0
 *
 * @apiName Add topic
 *
 * @apiGroup Article
 *
 * @apiDescription This path adds a new topic.
 *
 * @apiPermission staff2
 *
 * @apiParam {String} name Name of the new topic.
 * @apiParam {String} icon Icon of the new topic.
 * @apiParam {String} iconColor Icon's color of the new topic.
 * @apiParam {Boolean} private Indicates if the topic is not shown to users.
 *
 * @apiUse NO_PERMISSION 
 * @apiUse INVALID_TITLE
 * @apiUse NAME_ALREADY_USED
 * 
 * @apiSuccess {Object} data Topic info
 * @apiSuccess {Number} data.topicId Topic id
 *
 */

class AddTopicController extends Controller {
    const PATH = '/add-topic';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_2',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::notBlank()->length(LengthConfig::MIN_LENGTH_NAME, LengthConfig::MAX_LENGTH_NAME),
                    'error' => ERRORS::INVALID_NAME
                ],
            ]
        ];
    }

    public function handler() {

        $name = Controller::request('name', true);
        $icon = Controller::request('icon');
        $iconColor = Controller::request('iconColor');
        $private = Controller::request('private') ? 1 : 0;
        $CreatedTopic = Topic::getDataStore($name, 'name');

        if(!$CreatedTopic->isNull()){
            throw new RequestException(ERRORS::NAME_ALREADY_USED);
        }

        $topic = new Topic();
        $topic->setProperties([
            'name' => $name,
            'icon' => $icon,
            'iconColor' => $iconColor,
            'private' => $private
        ]);

        Log::createLog('ADD_TOPIC', $topic->name);

        Response::respondSuccess([
            'topicId' => $topic->store()
        ]);
    }
}
