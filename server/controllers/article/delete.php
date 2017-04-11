<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class DeleteArticleController extends Controller {
    const PATH = '/delete';
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
        Log::createLog('DELETE_ARTICLE', $article->title);

        $article->delete();

        Response::respondSuccess();
    }
}