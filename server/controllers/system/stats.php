<?php
use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;

/**
 * @api {post} /system/stats Get overall stats
 * @apiVersion 4.8.0
 *
 * @apiName Stats
 *
 * @apiGroup System
 *
 * @apiDescription This path retrieves the last stats.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} staffId Id of the current staff.

 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PERIOD
 *
 * @apiSuccess {[StatList](#api-Data_Structures-ObjectStatlist)[]} data Array of the stats
 *
 */

class StatsController extends Controller {
    const PATH = '/stats';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => []
        ];
    }

    public function handler() {
        Response::respondSuccess([
            'created' => $this->getNumberOfCreatedTickets(),
            'unsolved' => $this->getNumberOfUnsolvedTickets(),
            'solved' => $this->getNumberOfSolvedTickets(),
            'instant' => $this->getNumberOfInstantTickets(),
            'reopened' => $this->getNumberOfReopenedTickets()
        ]);
    }

    public function getNumberOfCreatedTickets() {
        return (int) RedBean::getCell('SELECT COUNT(*) FROM ticket');
    }

    public function getNumberOfUnsolvedTickets() {
        return (int) RedBean::getCell('SELECT COUNT(*) FROM ticket WHERE closed="0"');
    }

    public function getNumberOfSolvedTickets() {
        return (int) RedBean::getCell('SELECT COUNT(*) FROM ticket WHERE closed="1"');
    }

    public function getNumberOfInstantTickets() {
        return 0;
    }

    public function getNumberOfReopenedTickets() {
        return (int) RedBean::getCell('SELECT COUNT(*) FROM ticket WHERE reopened="1"');
    }
}
