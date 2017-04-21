<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

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