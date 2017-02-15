<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

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