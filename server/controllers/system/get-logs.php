<?php
use Respect\Validation\Validator as DataValidator;

class GetLogsController extends Controller {
    const PATH = '/get-logs';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'page' => [
                    'validation' => DataValidator::numeric(),
                    'error' => ERRORS::INVALID_PAGE
                ]
            ]
        ];
    }

    public function handler() {
        $page = Controller::request('page');
        $logList = Log::find('ORDER BY id desc LIMIT ? OFFSET ?', [10, 10*($page-1)]);

        Response::respondSuccess($logList->toArray());
    }
}