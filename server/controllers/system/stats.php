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
    private $dateRange;

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'dateRange' => [
                    'validation' => DataValidator::oneOf(DataValidator::validDateRange(), DataValidator::nullType()),
                    'error' => ERRORS::INVALID_DATE_RANGE_FILTER
                ],
            ]
        ];
    }

    public function handler() {
        $this->dateRange = json_decode(Controller::request('dateRange'));

        Response::respondSuccess([
            'created' => $this->getNumberOfCreatedTickets(),
            'open' => $this->getNumberOfOpenTickets(),
            'closed' => $this->getNumberOfClosedTickets(),
            'instant' => $this->getNumberOfInstantTickets(),
            'reopened' => $this->getNumberOfReopenedTickets()
        ]);
    }

    private function addDateRangeFilterQuery($hasPreviousCondition) {
        if ($this->dateRange === NULL) return " ";
        $sql = $hasPreviousCondition ? " AND " : " WHERE ";
        $sql .= " ticket.date >= {$this->dateRange[0]} AND ticket.date <= {$this->dateRange[1]} ";
        return $sql;
    }

    public function getNumberOfCreatedTickets() {
        return (int) RedBean::getCell('SELECT COUNT(*) FROM ticket' . $this->addDateRangeFilterQuery(false));
    }

    public function getNumberOfOpenTickets() {
        return (int) RedBean::getCell('SELECT COUNT(*) FROM ticket WHERE closed=0' . $this->addDateRangeFilterQuery(true));
    }

    public function getNumberOfClosedTickets() {
        return (int) RedBean::getCell('SELECT COUNT(*) FROM ticket WHERE closed=1' . $this->addDateRangeFilterQuery(true));
    }

    public function getNumberOfInstantTickets() {
        $dateRangeFilter = $this->addDateRangeFilterQuery(true);
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
                        {$dateRangeFilter}
                GROUP BY ticket_id
                HAVING COUNT(*) = 1) AS Z;
        ");
    }

    public function getNumberOfReopenedTickets() {
        return (int) RedBean::getCell('SELECT COUNT(*) FROM ticket WHERE reopened=1' . $this->addDateRangeFilterQuery(true));
    }
}
