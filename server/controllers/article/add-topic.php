<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /article/add-topic Add a new topic.
 *
 * @apiName Add topic
 *
 * @apiGroup article
 *
 * @apiDescription This path adds a new topic.
 *
 * @apiPermission Staff level 2
 *
 * @apiParam {String} name Name of the new topic.
 * @apiParam {String} icon Icon of the new topic.
 * @apiParam {String} iconColor Icon's color of the new topic.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_NAME
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
                    'validation' => DataValidator::length(3, 100),
                    'error' => ERRORS::INVALID_NAME
                ]
            ]
        ];
    }

    public function handler() {
        $topic = new Topic();
        $topic->setProperties([
            'name' => Controller::request('name'),
            'icon' => Controller::request('icon'),
            'iconColor' => Controller::request('iconColor')
        ]);

        Log::createLog('ADD_TOPIC', $topic->name);

        Response::respondSuccess([
            'topicId' => $topic->store()
        ]);
    }
}