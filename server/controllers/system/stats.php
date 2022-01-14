<?php
use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;

/**
 * @api {post} /system/get-stats Get overall stats
 * @apiVersion 4.11.0
 *
 * @apiName Stats
 *
 * @apiGroup System
 *
 * @apiDescription This path retrieves the last stats.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number[]} tags The ids of the tags for the custom stats.
 * @apiParam {Number[]} dateRange The array with start and end date of the range for the custom stats.
 * @apiParam {Number[]} departments The ids of the departments for the custom stats.
 * @apiParam {Number[]} owners The ids of the owners for the custom stats.
 * 
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PERIOD
 * @apiUse INVALID_DEPARTMENT_FILTER
 * @apiUse INVALID_DATE_RANGE_FILTER
 * @apiUse INVALID_OWNER_FILTER
 *
 * @apiSuccess {[StatList](#api-Data_Structures-ObjectStatlist)[]} data Array of the stats
 *
 */

class GetStatsController extends Controller {
    const PATH = '/get-stats';
    const METHOD = 'POST';
    private $table;
    private $groupBy;

    private $dateRangeFilter;
    private $departmentsFilter;
    private $tagsFilter;
    private $ownersFilter;

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
                'tags' => [
                    'validation' => DataValidator::oneOf(DataValidator::validTagsId(), DataValidator::nullType()),
                    'error' => ERRORS::INVALID_TAG_FILTER
                ],
                'owners' => [
                    'validation' => DataValidator::oneOf(DataValidator::validOwnersId(), DataValidator::nullType()),
                    'error' => ERRORS::INVALID_OWNER_FILTER
                ],
            ]
        ];
    }

    public function handler() {
        $this->table = " ticket LEFT JOIN ticketevent ON ticket.id = ticketevent.ticket_id 
                                LEFT JOIN tag_ticket  ON ticket.id = tag_ticket.ticket_id ";
        $this->groupBy = " GROUP BY ticket.id ";
        $this->dateRangeFilter = $this->addDateRangeFilter();
        $this->departmentsFilter = $this->addDepartmentsFilter();
        $this->tagsFilter = $this->addTagsFilter();
        $this->ownersFilter = $this->addOwnersFilter();

        Response::respondSuccess([
            'created' => $this->getNumberOfCreatedTickets(),
            'open' => $this->getNumberOfOpenTickets(),
            'closed' => $this->getNumberOfClosedTickets(),
            'instant' => $this->getNumberOfInstantTickets(),
            'reopened' => $this->getNumberOfReopenedTickets(),
            'created_by_hour' => $this->getNumberOfCreatedTicketsByHour(),
            'created_by_weekday' => $this->getNumberOfCreatedTicketsByWeekday(),
            'average_first_reply' => $this->getAverageFirstReply(),
            'average_first_closed' => $this->getAverageFirstClosed(),
            'average_last_closed' => $this->getAverageLastClosed(),
            'average_department_hops' => $this->getAverageDepartmentHops(),
            'average_staff_hops' => $this->getAverageStaffHops()
        ]);
    }

    // This function assumes there is a previous condition
    private function addDateRangeFilter() {
        $dateRange = json_decode(Controller::request('dateRange'));
        if ($dateRange === NULL) return " ";
        $sql = " AND ticket.date >= {$dateRange[0]} AND ticket.date <= {$dateRange[1]} ";
        return $sql;
    }

    // This function assumes there is a previous condition
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

    // This function assumes there is a previous condition
    private function addTagsFilter() {
        $tags = json_decode(Controller::request('tags'));
        if ($tags === NULL || empty($tags)) return " ";
        $sql = " AND ";
        for ($i = 0; $i < count($tags); ++$i) {
            $tagId = $tags[$i];
            $tags[$i] = " tag_ticket.tag_id={$tagId} ";
        }
        $sql .= '(' . join(" OR ", $tags) . ')';
        return $sql;
    }

    // This function assumes there is a previous condition
    private function addOwnersFilter() {
        $owners = json_decode(Controller::request('owners'));
        if ($owners === NULL || empty($owners)) return " ";
        $sql = " AND ";
        for ($i = 0; $i < count($owners); ++$i) {
            $ownerId = $owners[$i];
            $owners[$i] = " ticket.owner_id={$ownerId} ";
        }
        $sql .= '(' . join(" OR ", $owners) . ')';
        return $sql;
    }

    public function getNumberOfCreatedTickets() {
        return (int) RedBean::getCell("
            SELECT 
                COUNT(*)
            FROM
                (SELECT COUNT(*) FROM {$this->table} WHERE 1=1
                    {$this->dateRangeFilter}
                    {$this->departmentsFilter}
                    {$this->tagsFilter}
                    {$this->ownersFilter}
                {$this->groupBy}) AS Z;
        ");
    }

    public function getNumberOfOpenTickets() {
        return (int) RedBean::getCell("
            SELECT
                COUNT(*)
            FROM
                (SELECT COUNT(*) FROM {$this->table} WHERE closed=0
                    {$this->dateRangeFilter}
                    {$this->departmentsFilter}
                    {$this->tagsFilter}
                    {$this->ownersFilter}
                {$this->groupBy}) AS Z;
        ");
    }

    public function getNumberOfClosedTickets() {
        return (int) RedBean::getCell("
            SELECT
                COUNT(*)
            FROM
                (SELECT COUNT(*) FROM {$this->table} WHERE closed=1
                    {$this->dateRangeFilter}
                    {$this->departmentsFilter}
                    {$this->tagsFilter}
                    {$this->ownersFilter}
                {$this->groupBy}) AS Z;
        ");
    }

    public function getNumberOfInstantTickets() {
        return (int) RedBean::getCell("
            SELECT 
                COUNT(*)
            FROM
                (SELECT 
                    COUNT(*)
                FROM
                    {$this->table}
                WHERE
                    ticketevent.type = 'COMMENT'
                        AND ticketevent.author_staff_id
                        AND private = 0
                        AND closed = 1
                        {$this->dateRangeFilter}
                        {$this->departmentsFilter}
                        {$this->tagsFilter}
                        {$this->ownersFilter}
                {$this->groupBy}
                HAVING COUNT(*) = 1) AS Z;
        ");
    }

    public function getNumberOfReopenedTickets() {
        return (int) RedBean::getCell("
            SELECT
                COUNT(*)
            FROM
                (SELECT COUNT(*) FROM {$this->table} WHERE reopened=1
                    {$this->dateRangeFilter}
                    {$this->departmentsFilter}
                    {$this->tagsFilter}
                    {$this->ownersFilter}
                {$this->groupBy}) AS Z;
        ");
    }

    // Returns an array of size 24 with the number of tickets created for each hour
    public function getNumberOfCreatedTicketsByHour() {
        $result = RedBean::getAll("
            SELECT 
                VALID_TICKETS.HOUR_DAY, COUNT(RAW_CNT) AS CNT
            FROM
                (SELECT 
                    COUNT(*) AS RAW_CNT,
                    ticket.date % 10000 DIV 100 AS HOUR_DAY
                FROM {$this->table} WHERE 1=1
                    {$this->dateRangeFilter}
                    {$this->departmentsFilter}
                    {$this->tagsFilter}
                    {$this->ownersFilter}
                {$this->groupBy}) AS VALID_TICKETS
            GROUP BY VALID_TICKETS.HOUR_DAY;
        ");

        $ans = array_fill(0, 24, 0);
        for ($i = 0; $i < count($result); ++$i) {
            $hour = (int)$result[$i]["HOUR_DAY"];
            $cnt  = (int)$result[$i]["CNT"];
            $ans[$hour] = $cnt;
        }
        return $ans;
    }

    // Returns an array of size 7 with the number of tickets created by weekday (0 - monday, ..., 6 - sunday)
    public function getNumberOfCreatedTicketsByWeekday() {
        $result = RedBean::getAll("
            SELECT 
                VALID_TICKETS.WEEK_DAY, COUNT(RAW_CNT) AS CNT
            FROM
                (SELECT 
                    COUNT(*) AS RAW_CNT, WEEKDAY(STR_TO_DATE(CONVERT(ticket.date, CHAR), '%Y%m%d%H%i')) AS WEEK_DAY
                FROM {$this->table} WHERE 1 = 1
                    {$this->dateRangeFilter}
                    {$this->departmentsFilter}
                    {$this->tagsFilter}
                    {$this->ownersFilter}
                {$this->groupBy}) AS VALID_TICKETS
            GROUP BY VALID_TICKETS.WEEK_DAY;
        ");

        $ans = array_fill(0, 7, 0);
        for ($i = 0; $i < count($result); ++$i) {
            $hour = (int)$result[$i]["WEEK_DAY"];
            $cnt  = (int)$result[$i]["CNT"];
            $ans[$hour] = $cnt;
        }

        return $ans;
    }

    // Returns the number of seconds (as int), on average, that a ticket waits for the first reply of a staff
    public function getAverageFirstReply() {
        return (int) RedBean::getCell("
            SELECT AVG(SECS)
            FROM (
                SELECT 
                    ticket.id,
                    UNIX_TIMESTAMP(STR_TO_DATE(CONVERT(MIN(ticketevent.date), CHAR), '%Y%m%d%H%i')) - 
                    UNIX_TIMESTAMP(STR_TO_DATE(CONVERT(ticket.date, CHAR), '%Y%m%d%H%i')) AS SECS
                FROM
                    {$this->table}
                WHERE
                    ticketevent.type = 'COMMENT'
                        AND ticketevent.author_staff_id
                        AND private = 0
                        {$this->dateRangeFilter}
                        {$this->departmentsFilter}
                        {$this->tagsFilter}
                        {$this->ownersFilter}
                    {$this->groupBy}) AS Z;
        ");
    }

    // Returns the number of seconds (as int), on average, that a ticket waits until it's first closed
    public function getAverageFirstClosed() {
        return (int) RedBean::getCell("
            SELECT
                AVG(SECS)
            FROM
                (SELECT 
                    ticket.id,
                        UNIX_TIMESTAMP(STR_TO_DATE(CONVERT( MIN(ticket.first_closed_at) , CHAR), '%Y%m%d%H%i')) - UNIX_TIMESTAMP(STR_TO_DATE(CONVERT( ticket.date , CHAR), '%Y%m%d%H%i')) AS SECS
                FROM
                    {$this->table}
                WHERE
                    first_closed_at IS NOT NULL
                    {$this->dateRangeFilter}
                    {$this->departmentsFilter}
                    {$this->tagsFilter}
                    {$this->ownersFilter}
                {$this->groupBy}) AS Z;
        ");
    }

    // Returns the number of seconds (as int), on average, that a ticket waits until it's closed for the last time
    public function getAverageLastClosed() {
        return (int) RedBean::getCell("
            SELECT
                AVG(SECS)
            FROM
                (SELECT 
                    ticket.id,
                        UNIX_TIMESTAMP(STR_TO_DATE(CONVERT( MIN(ticket.last_closed_at) , CHAR), '%Y%m%d%H%i')) - UNIX_TIMESTAMP(STR_TO_DATE(CONVERT( ticket.date , CHAR), '%Y%m%d%H%i')) AS SECS
                FROM
                    {$this->table}
                WHERE
                    first_closed_at IS NOT NULL
                    {$this->dateRangeFilter}
                    {$this->departmentsFilter}
                    {$this->tagsFilter}
                    {$this->ownersFilter}
                {$this->groupBy}) AS Z;
        ");
    }

    // Returns the average number of departments (as double) a ticket has been in
    public function getAverageDepartmentHops() {
        return (double) RedBean::getCell("
            SELECT
                AVG(CNT)
            FROM
                (SELECT 
                    ticket.id, ticket.total_departments AS CNT
                FROM
                    {$this->table}
                WHERE
                    1 = 1
                    {$this->dateRangeFilter}
                    {$this->departmentsFilter}
                    {$this->tagsFilter}
                    {$this->ownersFilter}
                {$this->groupBy}) AS Z;
        ");
    }

    // Returns the average number of staff members a ticket has been assigned to
    public function getAverageStaffHops() {
        return (double) RedBean::getCell("
            SELECT
                AVG(CNT)
            FROM
                (SELECT 
                    ticket.id, ticket.total_owners AS CNT
                FROM
                    {$this->table}
                WHERE
                    1 = 1
                    {$this->dateRangeFilter}
                    {$this->departmentsFilter}
                    {$this->tagsFilter}
                    {$this->ownersFilter}
                {$this->groupBy}) AS Z;
        ");
    }
}
