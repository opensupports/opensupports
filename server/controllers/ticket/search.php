<?php
use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;
DataValidator::with('CustomValidations', true);


/**
 * @api {post} /ticket/search Search tickets
 * @apiVersion 4.6.1
 *
 * @apiName Search ticket
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path search specific tickets.
 *
 * @apiPermission user
 *
 * @apiParam {Number[]} tags The ids of the tags to make a custom search.
 * @apiParam {Number} closed The status of closed 1 or 0 to make a custom search.
 * @apiParam {Number} unreadStaff The status of unread_staff 1 or 0 to make a custom search.
 * @apiParam {Number[]} priority The values of priority to make a custom search.
 * @apiParam {Number[]} dateRange The numbers of the range of date to make a custom search.
 * @apiParam {Number[]} departments The ids of the departments to make a custom search.
 * @apiParam {Object[]} authors A object {id,staff} with id and boolean to make a custom search.
 * @apiParam {Number} assigned The status of assigned 1 or 0 to make a custom search.
 * @apiParam {String} query A string to find into a ticket to make a custom search.
 * @apiParam {Number} page The number of the page of the tickets.
 * @apiParam {Object} orderBy A object {value, asc}with string and boolean to make a especific order of the  search.
 * @apiParam {Number[]} owners The ids of the owners to make a custom search.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TAG_FILTER
 * @apiUse INVALID_CLOSED_FILTER
 * @apiUse INVALID_UNREAD_STAFF_FILTER
 * @apiUse INVALID_PRIORITY_FILTER
 * @apiUse INVALID_DATE_RANGE_FILTER
 * @apiUse INVALID_DEPARTMENT_FILTER
 * @apiUse INVALID_AUTHOR_FILTER
 * @apiUse INVALID_ASSIGNED_FILTER
 * @apiUse INVALID_ORDER_BY
 * @apiUse INVALID_PAGE
 *
 * @apiSuccess {Object} data Empty object
 *
 *

 */

class SearchController extends Controller {
    const PATH = '/search';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'page' => [
                    'validation' => DataValidator::oneOf(DataValidator::numeric()->positive(),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_PAGE
                ],
                'tags' => [
                    'validation' => DataValidator::oneOf(DataValidator::validTagsId(),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_TAG_FILTER
                ],
                'closed' => [
                    'validation' => DataValidator::oneOf(DataValidator::in(['0','1']),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_CLOSED_FILTER
                ],
                'unreadStaff' => [
                    'validation' => DataValidator::oneOf(DataValidator::in(['0','1']),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_UNREAD_STAFF_FILTER
                ],
                'priority' => [
                    'validation' => DataValidator::oneOf(DataValidator::validPriorities(),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_PRIORITY_FILTER
                ],
                'dateRange' => [
                    'validation' => DataValidator::oneOf(DataValidator::validDateRange(),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_DATE_RANGE_FILTER
                ],
                'departments' => [
                    'validation' => DataValidator::oneOf(DataValidator::validDepartmentsId(),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_DEPARTMENT_FILTER
                ],
                'authors' => [
                    'validation' => DataValidator::oneOf(DataValidator::validAuthorsId(),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_AUTHOR_FILTER
                ],
                'owners' => [
                    'validation' => DataValidator::oneOf(DataValidator::validOwnersId(),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_OWNER_FILTER
                ],
                'assigned' => [
                    'validation' => DataValidator::oneOf(DataValidator::in(['0','1']),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_ASSIGNED_FILTER
                ],
                'query' => [
                    'validation' => DataValidator::oneOf(DataValidator::notBlank(),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_QUERY_FILTER
                ],
                'orderBy' => [
                    'validation' => DataValidator::oneOf(DataValidator::validOrderBy(),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_ORDER_BY
                ],
            ]
        ];
    }

    public function handler() {

        $allowedDepartmentsId = [];
        foreach (Controller::getLoggedUser()->sharedDepartmentList->toArray() as $department) {
            array_push($allowedDepartmentsId,$department['id']);
        }

        $inputs = [
            'closed' => Controller::request('closed'),
            'tags' => json_decode(Controller::request('tags')),
            'unreadStaff' => Controller::request('unreadStaff'),
            'priority' => json_decode(Controller::request('priority')),
            'dateRange' => json_decode(Controller::request('dateRange')),
            'departments' => json_decode(Controller::request('departments')),
            'authors' => json_decode(Controller::request('authors'),true),
            'owners' => json_decode(Controller::request('owners')),
            'assigned' => Controller::request('assigned'),
            'query' => Controller::request('query'),
            'orderBy' => json_decode(Controller::request('orderBy'),true),
            'page' => Controller::request('page'),
            'allowedDepartments' => $allowedDepartmentsId,
            'staffId' => Controller::getLoggedUser()->id
        ];


        $query = $this->getSQLQuery($inputs);
        $queryWithOrder = $this->getSQLQueryWithOrder($inputs);
        $totalCount = RedBean::getAll("SELECT COUNT(*) FROM (SELECT COUNT(*) " . $query . " ) AS T2", [':query' => "%" . $inputs['query'] . "%"])[0]['COUNT(*)'];
        $ticketIdList = RedBean::getAll($queryWithOrder, [':query' => "%" . $inputs['query'] . "%"]);
        $ticketList = [];
        
        foreach ($ticketIdList as $item) {
            $ticket = Ticket::getDataStore($item['id']);
            array_push($ticketList, $ticket->toArray());
        }
        $ticketTableExists  = RedBean::exec("select table_name from information_schema.tables where table_name = 'ticket';");
        if($ticketTableExists){
            Response::respondSuccess([
                'tickets' => $ticketList,
                'pages' => ceil($totalCount / 10),
                'page' => $inputs['page'] ? ($inputs['page']*1) : 1
            ]);
        }else{
            Response::respondSuccess([]);
        }

    }

    public function getSQLQuery($inputs) {
        $tagsTableExists = RedBean::exec("select table_name from information_schema.tables where table_name = 'tag_ticket';");
        $ticketEventTableExists = RedBean::exec("select table_name from information_schema.tables where table_name = 'ticketevent';");

        $taglistQuery = ( $tagsTableExists ? " LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id" : '');
        $ticketeventlistQuery = ( $ticketEventTableExists ? " LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id" : '');

        $query = "FROM (ticket" . $taglistQuery . $ticketeventlistQuery .")";
        $filters = "";
        $this->setQueryFilters($inputs, $filters);
        $query .= $filters . " GROUP BY ticket.id";
        return $query;
    }

    public function getSQLQueryWithOrder($inputs) {
        $query = $this->getSQLQuery($inputs);
        $order = "";
        $query = "SELECT" . " ticket.id " . $query;

        $this->setQueryOrder($inputs, $order);
        $inputs['page'] ?  $page =  $inputs['page'] : $page  = 1 ;
        $query .= $order ." LIMIT 10 OFFSET " . (($page-1)*10);
        return $query;
    }

    //FILTER
    private function setQueryFilters($inputs, &$filters){
        if(array_key_exists('tags',$inputs)) $this->setTagFilter($inputs['tags'], $filters);
        if(array_key_exists('closed',$inputs)) $this->setClosedFilter($inputs['closed'], $filters);
        if(array_key_exists('assigned',$inputs)) $this->setAssignedFilter($inputs['assigned'], $filters);
        if(array_key_exists('unreadStaff',$inputs)) $this->setSeenFilter($inputs['unreadStaff'], $filters);
        if(array_key_exists('priority',$inputs)) $this->setPriorityFilter($inputs['priority'], $filters);
        if(array_key_exists('dateRange',$inputs)) $this->setDateFilter($inputs['dateRange'], $filters);
        if(array_key_exists('departments',$inputs) && array_key_exists('allowedDepartments',$inputs) && array_key_exists('staffId',$inputs)){
            $this->setDepartmentFilter($inputs['departments'],$inputs['allowedDepartments'], $inputs['staffId'], $filters);
        }
        if(array_key_exists('authors',$inputs)) $this->setAuthorFilter($inputs['authors'], $filters);
        if(array_key_exists('owners',$inputs)) $this->setOwnerFilter($inputs['owners'], $filters);
        if(array_key_exists('query',$inputs)) $this->setStringFilter($inputs['query'], $filters);
        if($filters != "") $filters =  " WHERE " . $filters;
    }

    private function setTagFilter($tagList, &$filters){
        $tagsTableExists = RedBean::exec("select table_name from information_schema.tables where table_name = 'tag_ticket';");

        if($tagList && $tagsTableExists){
            $filters != "" ? $filters .= " and " : null;

            foreach($tagList as $key => $tag) {

                $key == 0 ? $filters .= " ( " : null;
                ($key != 0 && $key != sizeof($tagList)) ? $filters .= " or " : null;

                $filters .= "tag_ticket.tag_id  = " . $tag ;
            }
            $filters .= ")";
        }
    }
    public function setClosedFilter($closed, &$filters){
       if ($closed !== null) {
            if ($filters != "")  $filters .= " and ";
            $filters .= "ticket.closed = " . $closed ;
        }
    }
    private function setSeenFilter($unreadStaff, &$filters){
       if ($unreadStaff !== null) {
            if ($filters != "")  $filters .= " and ";
            $filters .= "ticket.unread_staff = " . $unreadStaff;
        }
    }
    private function setPriorityFilter($priorities, &$filters){
        if($priorities){
            $first = TRUE;
            if ($filters != "")  $filters .= " and ";
            foreach(array_unique($priorities) as $priority) {

                if($first){
                    $filters .= " ( ";
                    $first = FALSE;
                } else {
                    $filters .= " or ";
                }

                if($priority == 0){
                    $filters .= "ticket.priority = 'low'";
                }elseif($priority == 1){
                    $filters .= "ticket.priority = 'medium'";
                }elseif($priority == 2){
                    $filters .= "ticket.priority = 'high'";
                }


            }
            $priorities != "" ? $filters .= ") " : null;
        }

    }

    private function setDateFilter($dateRange, &$filters){
       if ($dateRange !== null) {
            if ($filters != "")  $filters .= " and ";

            foreach($dateRange as $key => $date) {
                $key == 0 ? ($filters .= "(ticket.date >= " . $date ): ($filters .= " and ticket.date <= " . $date . ")");
            }
        }
    }

    private function setDepartmentFilter($requestedDepartments,$myDepartments, $idStaff, &$filters){
        if ($filters != "")  $filters .= " and ";
        if (!$requestedDepartments) $requestedDepartments = [];

        $requestedOwnedDepartments = $this->getRequestedOwnedDepartments($requestedDepartments, $myDepartments);
        $requestedNotOwnedDepartments =  $this->getRequestedNotOwnedDepartments($requestedDepartments, $myDepartments);
        $first = TRUE;
        
        if(!$requestedOwnedDepartments && !$requestedNotOwnedDepartments){
            foreach($myDepartments as $department) {
                if($first){
                    $filters .= " ( ";
                    $first = FALSE;
                } else {
                    $filters .= " or ";
                }
                $filters .= "ticket.department_id = " . $department;
            } 
            $filters .= ")";
        } 
        
        if($requestedOwnedDepartments){
            foreach($requestedOwnedDepartments as $department) {
                if($first){
                    $filters .= " ( ";
                    $first = FALSE;
                } else {
                    $filters .= " or ";
                }
                $filters .= "ticket.department_id = " . $department;
            }
        }
        
        if($requestedNotOwnedDepartments){
            if($requestedOwnedDepartments) $filters .= " or ";
            $filters .= "(ticket.author_staff_id = " . $idStaff . " and ";
            $first = TRUE;
            foreach($requestedNotOwnedDepartments as $department) {
                if($first){
                    $filters .= " ( ";
                    $first = FALSE;
                } else {
                    $filters .= " or ";
                }
                $filters .= "ticket.department_id = " . $department;
            }
            $filters .= "))";
        }
        if($requestedOwnedDepartments) $filters .= " )";
    }

    private function setAuthorFilter($authors, &$filters){
        if($authors !== null){
            $first = TRUE;
            if ($filters != "")  $filters .= " and ";

            foreach($authors as $author){

                if($first){
                    $filters .= " ( ";
                    $first = FALSE;
                } else {
                    $filters .= " or ";
                }

                if($author['staff']){
                    $filters .= "ticket.author_staff_id  = " . $author['id'];
                } else {
                    $filters .= "ticket.author_id = " . $author['id'];
                }
            }
            $filters .= ")";
        }
    }

    private function setOwnerFilter($owners, &$filters){
        if($owners){
            $first = TRUE;
            if ($filters != "")  $filters .= " and ";

            foreach($owners as $owner){

                if($first){
                    $filters .= "(";
                    $first = FALSE;
                } else {
                    $filters .= " or ";
                }
                $filters .= "ticket.owner_id = " . $owner;
            }

            $filters .= ")";
        }
    }

    private function setAssignedFilter($assigned, &$filters){
       if($assigned !== null){
            if ($filters != "")  $filters .= " and ";
            $key = "";
            $assigned == 0 ? $key = "IS NULL" : $key = "IS NOT NULL";
            $filters .= "ticket.owner_id " . $key;
       }
    }

    private function setStringFilter($search, &$filters){
        $ticketEventTableExists = RedBean::exec("select table_name from information_schema.tables where table_name = 'ticketevent';");

        if($search !== null){
            if ($filters != "")  $filters .= " and ";
            $ticketevent = ( $ticketEventTableExists ? " or (ticketevent.type = 'COMMENT' and ticketevent.content LIKE :query)" : "");
            $filters .= " (ticket.title LIKE :query or ticket.content LIKE :query or ticket.ticket_number LIKE :query". $ticketevent  ." )";
        };
    }
                       
    private function getRequestedOwnedDepartments($requestedDepartments, $myDepartments){
        $requestedOwnedDepartments = [];
        $requestedOwnedDepartments = array_values(array_unique(array_intersect($requestedDepartments, $myDepartments)));
        
        return $requestedOwnedDepartments;
    }

    private function getRequestedNotOwnedDepartments($requestedDepartments, $myDepartments){
        $requestedNotOwnedDepartments = [];
        $requestedOwnedDepartments = [];
        $requestedOwnedDepartments = array_values(array_unique(array_intersect($requestedDepartments, $myDepartments)));
        $requestedNotOwnedDepartments = array_values(array_diff($requestedDepartments, $requestedOwnedDepartments));
        
        return $requestedNotOwnedDepartments;
    }

    //ORDER
    private function setQueryOrder($inputs, &$order){
        $order =  " ORDER BY ";
        if(array_key_exists('query',$inputs)) $this->setStringOrder($inputs['query'], $order);
        if(array_key_exists('orderBy',$inputs)) $this->setEspecificOrder($inputs['orderBy'], $order);
        $order .=  "ticket.closed asc, ticket.owner_id asc, ticket.unread_staff asc, ticket.priority desc, ticket.date desc ";
    }
    private function setEspecificOrder($orderBy, &$order){
        if($orderBy !== null){
            $orientation = ($orderBy['asc'] ? " asc" : " desc" );
            $order .= "ticket." . $orderBy['value'] . $orientation . ",";
        };
    }
    private function setStringOrder($querysearch, &$order){
        $ticketEventTableExists = RedBean::exec("select table_name from information_schema.tables where table_name = 'ticketevent';");

        if($querysearch !== null){
            $ticketeventOrder =  ( $ticketEventTableExists ? " CASE WHEN (ticketevent.type = 'COMMENT' and ticketevent.content LIKE :query) THEN ticketevent.content END desc," : "");
            $order .= "CASE WHEN (ticket.ticket_number LIKE :query) THEN ticket.ticket_number END desc,CASE WHEN (ticket.title LIKE :query) THEN ticket.title END desc, CASE WHEN ( ticket.content LIKE :query) THEN ticket.content END desc," . $ticketeventOrder ;
        }
    }

}
