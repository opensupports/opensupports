<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class EditArticleController extends Controller {
    const PATH = '/edit';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_2',
            'requestData' => [
                'articleId' => [
                    'validation' => DataValidator::dataStoreId('article'),
                    'error' => ERRORS::INVALID_TOPIC
                ]
            ]
        ];
    }

    public function handler() {
        $article = Article::getDataStore(Controller::request('articleId'));

        if (Controller::request('topicId')) {
            $newArticleTopic = Topic::getDataStore(Controller::request('topicId'));

            if (!$newArticleTopic->isNull()) {
                $article->topic = $newArticleTopic;
            } else {
                Response::respondError(ERRORS::INVALID_TOPIC);
                return;
            }
        }

        if(Controller::request('content')) {
            $article->content = Controller::request('content');
        }

        if(Controller::request('title')) {
            $article->title = Controller::request('title');
        }

        if(Controller::request('position')) {
            $article->position = Controller::request('position');
        }

        $article->lastEdited = Date::getCurrentDate();

        $article->store();

        Log::createLog('EDIT_ARTICLE', $article->title);

        Response::respondSuccess();
    }
}