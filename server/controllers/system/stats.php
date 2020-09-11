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
        return (int) RedBean::getCell('SELECT COUNT(*) FROM ticket WHERE closed=0');
    }

    public function getNumberOfSolvedTickets() {
        return (int) RedBean::getCell('SELECT COUNT(*) FROM ticket WHERE closed=1');
    }

    public function getNumberOfInstantTickets() {
        return (int) RedBean::getCell("
            SELECT 
                COUNT(*)
            FROM
                (SELECT 
                    COUNT(*)
                FROM
                    ticketevent
                JOIN ticket ON ticket.id = ticketevent.ticket_id
                WHERE
                    ticketevent.type = 'COMMENT'
                        AND ticketevent.author_staff_id
                        AND private = 0
                        AND closed = 1
                GROUP BY ticket_id
                HAVING COUNT(*) = 1) AS Z;
        ");
    }

    public function getNumberOfReopenedTickets() {
        return (int) RedBean::getCell('SELECT COUNT(*) FROM ticket WHERE reopened="1"');
    }
}
