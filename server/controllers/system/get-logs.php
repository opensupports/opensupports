<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/get-logs retrieve logs.
 *
 * @apiName Get logs
 *
 * @apiGroup system
 *
 * @apiDescription This path retrieves the all logs.
 *
 * @apiPermission Staff level 1
 *
 * @apiParam {Number} page The page of logs.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PAGE
 *
 * @apiSuccess {[Log](#api-Data_Structures-ObjectLog)[]} data Array of last logs
 *
 */

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