<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /article/edit-topic Edit topic
 * @apiVersion 4.11.0
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
 * @apiUse INVALID_TITLE
 * @apiUse NAME_ALREADY_USED
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
                    'validation' => DataValidator::notBlank()->length(LengthConfig::MIN_LENGTH_NAME, LengthConfig::MAX_LENGTH_NAME),
                    'error' => ERRORS::INVALID_NAME
                ]
            ]
        ];
    }

    public function handler() {
        $topic = Topic::getDataStore(Controller::request('topicId'));
        $name = Controller::request('name');
        $iconColor = Controller::request('iconColor');
        $private = Controller::request('private');
        $icon = Controller::request('icon');
        $createdArticleTookByName = Topic::getDataStore($name, 'name');

        if(!$createdArticleTookByName->isNull() && $topic->id !== $createdArticleTookByName->id){
            throw new RequestException(ERRORS::NAME_ALREADY_USED);
        }

        if($name) {
            $topic->name = Controller::request('name', true);
        }

        if($iconColor) {
            $topic->iconColor = $iconColor;
        }

        if($icon) {
            $topic->icon = $icon;
        }
        if ($private !== null) {
            $topic->private = $private;
        }

        $topic->store();
        Response::respondSuccess();
    }
}
