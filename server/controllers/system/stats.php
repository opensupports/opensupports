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
 * @apiParam {Number[]} dateRange The array with start and end date of the range for the custom stats.
 * @apiParam {Number[]} departments The ids of the departments for the custom stats.
 * 
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PERIOD
 * @apiUse INVALID_DEPARTMENT_FILTER
 * @apiUse INVALID_DATE_RANGE_FILTER
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
            'requestData' => [
                'dateRange' => [
                    'validation' => DataValidator::oneOf(DataValidator::validDateRange(), DataValidator::nullType()),
                    'error' => ERRORS::INVALID_DATE_RANGE_FILTER
                ],
                'departments' => [
                    'validation' => DataValidator::oneOf(DataValidator::validDepartmentsId(), DataValidator::nullType()),
                    'error' => ERRORS::INVALID_DEPARTMENT_FILTER
                ],
            ]
        ];
    }

    public function handler() {
        $this->addDepartmentsFilter(false);
        Response::respondSuccess([
            'created' => $this->getNumberOfCreatedTickets(),
            'open' => $this->getNumberOfOpenTickets(),
            'closed' => $this->getNumberOfClosedTickets(),
            'instant' => $this->getNumberOfInstantTickets(),
            'reopened' => $this->getNumberOfReopenedTickets()
        ]);
    }

    // This function assumes there is a previous condition (previous WHERE)
    private function addDateRangeFilter() {
        $dateRange = json_decode(Controller::request('dateRange'));
        if ($dateRange === NULL) return " ";
        $sql = " AND ticket.date >= {$dateRange[0]} AND ticket.date <= {$dateRange[1]} ";
        return $sql;
    }

    // This function assumes there is a previous condition (previous WHERE)
    private function addDepartmentsFilter() {
        $departments = json_decode(Controller::request('departments'));
        if ($departments === NULL || empty($departments)) return " ";
        $sql = " AND ";
        for ($i = 0; $i < count($departments); ++$i) {
            $departmentId = $departments[$i];
            $departments[$i] = " ticket.department_id={$departmentId} ";
        }
        $sql .= '(' . join(" OR ", $departments) . ')';
        return $sql;
    }

    public function getNumberOfCreatedTickets() {
        return (int) RedBean::getCell('SELECT COUNT(*) FROM ticket WHERE 1=1' . 
            $this->addDateRangeFilter() .
            $this->addDepartmentsFilter()
        );
    }

    public function getNumberOfOpenTickets() {
        return (int) RedBean::getCell('SELECT COUNT(*) FROM ticket WHERE closed=0' . 
            $this->addDateRangeFilter() .
            $this->addDepartmentsFilter()
        );
    }

    public function getNumberOfClosedTickets() {
        return (int) RedBean::getCell('SELECT COUNT(*) FROM ticket WHERE closed=1' . 
            $this->addDateRangeFilter() .
            $this->addDepartmentsFilter()
        );
    }

    public function getNumberOfInstantTickets() {
        $dateRangeFilter = $this->addDateRangeFilter();
        $departmentsFilter = $this->addDepartmentsFilter();
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
                        {$departmentsFilter}
                GROUP BY ticket_id
                HAVING COUNT(*) = 1) AS Z;
        ");
    }

    public function getNumberOfReopenedTickets() {
        return (int) RedBean::getCell('SELECT COUNT(*) FROM ticket WHERE reopened=1' . 
            $this->addDateRangeFilter() .
            $this->addDepartmentsFilter()
        );
    }
}
