<?php
// MOCKS
include_once 'tests/__lib__/Mock.php';
include_once 'tests/__mocks__/NullDataStoreMock.php';
include_once 'tests/__mocks__/ResponseMock.php';
include_once 'tests/__mocks__/ControllerMock.php';
include_once 'tests/__mocks__/SessionMock.php';
include_once 'tests/__mocks__/UserMock.php';
include_once 'tests/__mocks__/HashingMock.php';
include_once 'tests/__mocks__/SessionCookieMock.php';
include_once 'tests/__mocks__/RedBeanMock.php';
include_once 'data/ERRORS.php';

use PHPUnit\Framework\TestCase;
use RedBeanPHP\Facade as RedBean;

class SearchControllerTest extends TestCase {
    private $searchController;

    protected function setUp() {
        Session::initStubs();
        Response::initStubs();
        RedBean::initStubs();
        RedBean::setStatics([
            'exec' => \Mock::stub()->returns(1)
        ]);
        Controller::$requestReturnMock = null;
        $_SERVER['REMOTE_ADDR'] = 'MOCK_REMOTE';
        $this->searchController = new SearchController();
    }

    public function testTagsFilter() {
        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'tags' => []
            ])
        );

        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  ( tag_ticket.tag_id  = 0) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'tags' => [0]
            ])
        );

        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  ( tag_ticket.tag_id  = 0 or tag_ticket.tag_id  = 1 or tag_ticket.tag_id  = 2) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'tags' => [0,1,2]
            ])
        );
    }

    public function testClosedFilter() {

        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'closed'=> null
            ])
        );


        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE ticket.closed = 1 GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'closed'=> 1
            ])
        );

        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE ticket.closed = 0 GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'closed'=> '0'
            ])
        );
    }
    public function testAssignedFilter(){

        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'assigned'=> null
            ])
        );

        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE ticket.owner_id IS NULL GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'assigned'=> '0'
            ])
        );

        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE ticket.owner_id IS NOT NULL GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'assigned'=> 1
            ])
        );
    }
    public function testUnreadStaffFilter() {
        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'unreadStaff' => null
            ])
        );

        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE ticket.unread_staff = 0 GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'unreadStaff' => '0'
            ])
        );

        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE ticket.unread_staff = 1 GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'unreadStaff' => 1
            ])
        );
    }

    public function testdateRangeFilter() {
        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'dateRange' => null
            ])
        );

        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE (ticket.date >= 1 and ticket.date <= 2) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'dateRange' => [1,2]
            ])
        );
    }

    public function testOwnerFilter() {
        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE (ticket.owner_id = 1 or ticket.owner_id = 2) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'owners' => [1,2]
            ])
        );

        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE (ticket.owner_id = 6 or ticket.owner_id = 1 or ticket.owner_id = 9) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'owners' => [6,1,9]
            ])
        );

        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'owners' => []
            ])
        );
    }

    public function testDepartmentsFilter() {
        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE (ticket.author_staff_id = 1 or ticket.department_id = 2 or ticket.department_id = 1 or ticket.department_id = 3) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'departments' => null,
                'staffId' => 1,
                'allowedDepartments' => [2,1,3]
            ])
        );

        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  ( ticket.department_id = 1 ) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'departments' => [1],
                'staffId' => 1,
                'allowedDepartments' => [2,1,3]
            ])
        );

        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  ( ticket.department_id = 1 or ticket.department_id = 2 or (ticket.author_staff_id = 1 and  ( ticket.department_id = 3 or ticket.department_id = 4)) ) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'departments' => [1,2,3,4],
                'staffId' => 1,
                'allowedDepartments' => [2,1]
            ])
        );

        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE (ticket.author_staff_id = 1 and  ( ticket.department_id = 2)) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'departments' => [2],
                'staffId' => 1,
                'allowedDepartments' => [5,6]
            ])
        );
    }

    public function testAuthorsFilter() {
        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'authors' => []
            ])
        );
        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  ( ticket.author_staff_id  = 1 or ticket.author_id = 2) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'authors' => [
                    [
                        'id' => 1,
                        'isStaff' => 1
                    ],
                    [
                        'id' => 2,
                        'isStaff' => 0
                    ]
                ]
            ])
        );
    }

    public function testQueryFilter() {
        $this->assertEquals(
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id',
            $this->searchController->getSQLQuery([
                'query' => null
            ])
        );

        $this->assertEquals(
            "FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  (ticket.title LIKE :query or ticket.content LIKE :query or ticket.ticket_number LIKE :query or (ticketevent.type = 'COMMENT' and ticketevent.content LIKE :query) ) GROUP BY ticket.id",
            $this->searchController->getSQLQuery([
                'query' => 'hello world'
            ])
        );
    }

    public function testQueryWithOrder() {
        $inputs1 = [
            'page' => 1
        ];
        $inputs2 = [
            'page' => 1,
            'query' => 'stark'
        ];
        $inputs3 = [
            'page' => 1,
            'orderBy' => ['value' => 'closed', 'asc' => 1]
        ];
        $this->assertEquals(
            "SELECT ticket.id FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id ORDER BY ticket.closed asc, ticket.owner_id asc, ticket.unread_staff asc, ticket.date desc, ticket.id desc LIMIT 10 OFFSET 0",
            $this->searchController->getSQLQueryWithOrder($inputs1, $this->searchController->getSQLQuery($inputs1))
        );

        $this->assertEquals(
            "SELECT ticket.id FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  (ticket.title LIKE :query or ticket.content LIKE :query or ticket.ticket_number LIKE :query or (ticketevent.type = 'COMMENT' and ticketevent.content LIKE :query) ) GROUP BY ticket.id ORDER BY CASE WHEN (ticket.ticket_number LIKE :query) THEN 1 WHEN (ticket.title LIKE :queryAtBeginning) THEN 2 WHEN (ticket.title LIKE :query) THEN 3 WHEN ( ticket.content LIKE :query) THEN 4  WHEN (ticketevent.content LIKE :query) THEN 5 END asc, ticket.closed asc, ticket.owner_id asc, ticket.unread_staff asc, ticket.date desc, ticket.id desc LIMIT 10 OFFSET 0",
            $this->searchController->getSQLQueryWithOrder($inputs2, $this->searchController->getSQLQuery($inputs2))
        );

        $this->assertEquals(
            "SELECT ticket.id FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id ORDER BY ticket.closed asc,ticket.closed asc, ticket.owner_id asc, ticket.unread_staff asc, ticket.date desc, ticket.id desc LIMIT 10 OFFSET 0",
            $this->searchController->getSQLQueryWithOrder($inputs3, $this->searchController->getSQLQuery($inputs3))
        );
    }
}
