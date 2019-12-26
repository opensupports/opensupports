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
            $this->searchController->getSQLQuery([
                'tags' => []
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id'
        );

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'tags' => [0]
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  ( tag_ticket.tag_id  = 0) GROUP BY ticket.id'
        );

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'tags' => [0,1,2]
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  ( tag_ticket.tag_id  = 0 or tag_ticket.tag_id  = 1 or tag_ticket.tag_id  = 2) GROUP BY ticket.id'
        );
    }

    public function testClosedFilter() {

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'closed'=> null
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id'
        );


        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'closed'=> 1
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE ticket.closed = 1 GROUP BY ticket.id'
        );

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'closed'=> '0'
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE ticket.closed = 0 GROUP BY ticket.id'
        );
    }
    public function testAssignedFilter(){

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'assigned'=> null
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id'
        );

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'assigned'=> '0'
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE ticket.owner_id IS NULL GROUP BY ticket.id'
        );

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'assigned'=> 1
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE ticket.owner_id IS NOT NULL GROUP BY ticket.id'
        );
    }
    public function testUnreadStaffFilter() {
        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'unreadStaff' => null
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id'
        );

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'unreadStaff' => '0'
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE ticket.unread_staff = 0 GROUP BY ticket.id'
        );

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'unreadStaff' => 1
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE ticket.unread_staff = 1 GROUP BY ticket.id'
        );
    }

    public function testPriorityFilter() {

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'tags' => []
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id'
        );

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'tags' => [1]
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  ( tag_ticket.tag_id  = 1) GROUP BY ticket.id'
        );

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'tags' => [2,3]
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  ( tag_ticket.tag_id  = 2 or tag_ticket.tag_id  = 3) GROUP BY ticket.id'
        );

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'tags' => [1,2,3]
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  ( tag_ticket.tag_id  = 1 or tag_ticket.tag_id  = 2 or tag_ticket.tag_id  = 3) GROUP BY ticket.id'
        );
    }

    public function testdateRangeFilter() {
        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'dateRange' => null
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id'
        );

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'dateRange' => [1,2]
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE (ticket.date >= 1 and ticket.date <= 2) GROUP BY ticket.id'
        );
    }

    public function testDepartmentsFilter() {
        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'departments' => null,
                'allowedDepartments' => [
                    [
                        'id' => 2
                    ],
                    [
                        'id' => 1
                    ],
                    [
                        'id' => 3
                    ]
                ]
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  ( ticket.department_id = 2 or ticket.department_id = 1 or ticket.department_id = 3) GROUP BY ticket.id'
        );

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'departments' => [1],
                'allowedDepartments' => [
                    [
                        'id' => 2
                    ],
                    [
                        'id' => 1
                    ],
                    [
                        'id' => 3
                    ]
                ]
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  ( ticket.department_id = 1) GROUP BY ticket.id'
        );

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'departments' => [1,2,3],
                'allowedDepartments' => [
                    [
                        'id' => 2
                    ],
                    [
                        'id' => 1
                    ],
                    [
                        'id' => 3
                    ]
                ]
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  ( ticket.department_id = 1 or ticket.department_id = 2 or ticket.department_id = 3) GROUP BY ticket.id'
        );
    }

    public function testAuthorsFilter() {
        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'authors' => null
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id'
        );
        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'authors' => [
                    [
                        'id' => 1,
                        'staff' => 1
                    ],
                    [
                        'id' => 2,
                        'staff' => 0
                    ]
                ]
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  ( ticket.author_staff_id  = 1 or ticket.author_id = 2) GROUP BY ticket.id'
        );
    }

    public function testQueryFilter() {
        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'query' => null
            ]),
            'FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id'
        );

        $this->assertEquals(
            $this->searchController->getSQLQuery([
                'query' => 'hello world'
            ]),
            "FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  (ticket.title LIKE :query or ticket.content LIKE :query or ticket.ticket_number LIKE :query or (ticketevent.type = 'COMMENT' and ticketevent.content LIKE :query) ) GROUP BY ticket.id"

        );
    }
    public function testQueryWithOrder() {
        $this->assertEquals(
            $this->searchController->getSQLQueryWithOrder([
                'page' => 1
            ]),
            "SELECT ticket.id FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id ORDER BY ticket.closed asc, ticket.owner_id asc, ticket.unread_staff asc, ticket.priority desc, ticket.date desc  LIMIT 10 OFFSET 0"
        );

        $this->assertEquals(
            $this->searchController->getSQLQueryWithOrder([
                'page' => 1,
                'query' => 'stark'
            ]),
            "SELECT ticket.id FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) WHERE  (ticket.title LIKE :query or ticket.content LIKE :query or ticket.ticket_number LIKE :query or (ticketevent.type = 'COMMENT' and ticketevent.content LIKE :query) ) GROUP BY ticket.id ORDER BY CASE WHEN (ticket.ticket_number LIKE '%stark%') THEN ticket.ticket_number END desc,CASE WHEN (ticket.title LIKE '%stark%') THEN ticket.title END desc, CASE WHEN ( ticket.content LIKE '%stark%') THEN ticket.content END desc, CASE WHEN (ticketevent.type = 'COMMENT' and ticketevent.content LIKE '%stark%') THEN ticketevent.content END desc,ticket.closed asc, ticket.owner_id asc, ticket.unread_staff asc, ticket.priority desc, ticket.date desc  LIMIT 10 OFFSET 0"
        );

        $this->assertEquals(
            $this->searchController->getSQLQueryWithOrder([
                'page' => 1,
                'orderBy' => ['value' => 'closed', 'asc' => 1]
            ]),
            "SELECT ticket.id FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id) GROUP BY ticket.id ORDER BY ticket.closed asc,ticket.closed asc, ticket.owner_id asc, ticket.unread_staff asc, ticket.priority desc, ticket.date desc  LIMIT 10 OFFSET 0"
        );
    }
}
