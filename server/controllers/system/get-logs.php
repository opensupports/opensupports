<?php
use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;

/**
 * @api {post} /system/get-logs Get logs
 * @apiVersion 4.6.1
 *
 * @apiName Get logs
 *
 * @apiGroup System
 *
 * @apiDescription This path retrieves the all the logs.
 *
 * @apiPermission staff1
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
        $this->deleteLastLogs();
        $page = Controller::request('page');
        $logList = Log::find('ORDER BY id desc LIMIT ? OFFSET ?', [10, 10*($page-1)]);

        Response::respondSuccess($logList->toArray());
    }

    public function deleteLastLogs() {
        $removeOlderThanDays = 31;
        $oldDate = floor(Date::getPreviousDate($removeOlderThanDays) / 10000);

        try {
            RedBean::exec("DELETE FROM log WHERE date < $oldDate");
        } catch(Exception $e) {}
    }
}
