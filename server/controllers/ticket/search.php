<?php
use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;
DataValidator::with('CustomValidations', true);


/**
 * @api {post} /ticket/search Search tickets
 * @apiVersion 4.5.0
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
            'permission' => 'any',
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
                    'validation' => DataValidator::oneOf(DataValidator::validPrioritys(),DataValidator::nullType()),
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
                'assigned' => [
                    'validation' => DataValidator::oneOf(DataValidator::in(['0','1']),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_ASSIGNED_FILTER
                ],
                'orderBy' => [
                    'validation' => DataValidator::oneOf(DataValidator::ValidOrderBy(),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_ORDER_BY
                ],
            ]
        ];
    }

    public function handler() {
        $query = "FROM (ticket LEFT JOIN tag_ticket ON tag_ticket.ticket_id = ticket.id LEFT JOIN ticketevent ON ticketevent.ticket_id = ticket.id)";
        $filters = "";
        $order = "";
        Controller::request("page") ?  $page =  Controller::request("page") : $page  = 1 ;

        $this->setQueryFilters($filters);
        $query .= $filters . " GROUP BY ticket.id";

        $totalCount = RedBean::getAll("SELECT COUNT(*) FROM (SELECT COUNT(*) " . $query . " ) AS T2")[0]['COUNT(*)'];
        error_log(print_r("SELECT COUNT(*) FROM (SELECT COUNT(*) " . $query . " ) AS T2", true));
        error_log(print_r($totalCount, true));

        $query = "SELECT ticket.id,ticket.title,ticket.ticket_number,ticket.content ,ticketevent.content " . $query;

        $this->setQueryOrder($order);
        $query .= $order ." LIMIT 10 OFFSET " . (($page-1)*10);
        
        $ticketList = RedBean::getAll($query);

        Response::respondSuccess([
            'tickets' => $ticketList,
            'pages' => ceil($totalCount / 10),
            'page' => Controller::request('page')
        ]);

    }
    //FILTER
    private function setQueryFilters(&$filters){
        $this->setTagFilter($filters);
        $this->setClosedFilter($filters);
        $this->setAssignedFilter($filters);
        $this->setSeenFilter($filters);
        $this->setPriorityFilter($filters);
        $this->setDateFilter($filters);
        $this->setDepartmentFilter($filters);
        $this->setAuthorFilter($filters);
        $this->setStringFilter($filters);

        if($filters != "") $filters =  " WHERE " . $filters;
    }
    
    private function setTagFilter(&$filters){
       $tagList = json_decode(Controller::request('tags'));

        if($tagList){
            $filters != "" ? $filters .= " and " : null;

            foreach($tagList as $key => $tag) {  

                $key == 0 ? $filters .= " ( " : null;
                ($key != 0 && $key != sizeof($tagList)) ? $filters .= " or " : null;
                
                $filters .= "tag_ticket.tag_id  = " . $tag ;
            }
            $filters .= ")";
        }
    }
    private function setClosedFilter(&$filters){
       $closed = Controller::request('closed');

       if ($closed != null) {
            if ($filters != "")  $filters .= " and ";
            $filters .= "ticket.closed = " . $closed ;
        } 
    }
    private function setSeenFilter(&$filters){
       $unreadStaff = Controller::request('unreadStaff');
       if ($unreadStaff != null) {
            if ($filters != "")  $filters .= " and ";
            $filters .= "ticket.unread_staff = " . $unreadStaff;
        } 
    }
    private function setPriorityFilter(&$filters){
        $prioritys = json_decode(Controller::request('priority'));
        if($prioritys != null){
            if ($filters != "")  $filters .= " and ";
            foreach(array_unique($prioritys) as $key => $priority) {

                $key == 0 ? $filters .= " ( " : null;
                ($key != 0 && $key != sizeof($prioritys)) ? $filters .= " or " : null;
                
                if($priority == 0){
                    $filters .= "ticket.priority = " . "'low'";
                }elseif($priority == 1){
                    $filters .= "ticket.priority = " . "'medium'";
                }elseif($priority == 2){
                    $filters .= "ticket.priority = " . "'high'";
                }

                $key == sizeof($prioritys) ? $filters .= " ) " : null ;
            }
            $prioritys != "" ? $filters .= ") " : null;
        }
    }
    
    private function setDateFilter(&$filters){
       $dateRange = json_decode(Controller::request('dateRange'));
       if ($dateRange != null) {
            if ($filters != "")  $filters .= " and ";

            foreach($dateRange as $key => $date) {
                $key == 0 ? ($filters .= "(ticket.date >= " . $date ): ($filters .= " and ticket.date <= " . $date . ")");
            }
        } 
    }

    private function setDepartmentFilter(&$filters){
        
        $departments = json_decode(Controller::request('departments'));

        if($departments != null){
            if ($filters != "")  $filters .= " and ";

            foreach($departments as $key => $department) {  

                $key == 0 ? $filters .= " ( " : null;
                ($key != 0 && $key != sizeof($departments)) ? $filters .= " or " : null;
                
                $filters .= "ticket.department_id = " . $department ;
            }
            $filters .= ")";
        }
    }

    private function setAuthorFilter(&$filters){
        $authors = json_decode(Controller::request('authors'));

        if($authors != null){

            if ($filters != "")  $filters .= " and ";
            
            foreach($authors as $key => $author){

                $key == 0 ? $filters .= " ( " : null;
                ($key != 0 && $key != sizeof($authors)) ? $filters .= " or " : null;
                
                if($author->staff){
                    $filters .= "ticket.author_staff_id  = " . $author->id;
                } else {
                    $filters .= "ticket.author_id = " . $author->id;
                }
            }

            $filters .= ")";
        
        }
    }

    private function setAssignedFilter(&$filters){
       $assigned = Controller::request('assigned');
       if($assigned != null){
            if ($filters != "")  $filters .= " and ";
            $key = "";
            $assigned == 0 ? $key = "IS NULL" : $key = "IS NOT NULL";
            $filters .= "ticket.owner_id " . $key;
       }
    }

    private function setStringFilter(&$filters){
        $string = Controller::request('query');
        if($string != null){
            if ($filters != "")  $filters .= " and ";
            $filters .= " (ticket.title LIKE '%" . $string . "%' or ticket.content LIKE '%" . $string . "%' or ticket.ticket_number LIKE '%" . $string . "%' or (ticketevent.type = 'COMMENT' and ticketevent.content LIKE '%" . $string ."%'))";
        };
    }

    //ORDER
    private function setQueryOrder(&$order){
        $order =  " ORDER BY ";
        $this->setStringOrder($order);
        $this->setEspecificOrder($order);     
        $order .=  "ticket.closed asc, ticket.owner_id asc, ticket.unread_staff asc, ticket.priority desc, ticket.date desc ";
    }
    private function setEspecificOrder(&$order){
        $orderBy = json_decode(Controller::request('orderBy'));
        if($orderBy != null){
            $orientation = ($orderBy->asc ? " asc" : " desc" );
            $order .= "ticket." . $orderBy->value . $orientation . ",";
        };
    }
    private function setStringOrder(&$order){
        $string = Controller::request('query');
        if($string != null){
            $order .= "CASE WHEN (ticket.ticket_number LIKE '%" . $string ."%') THEN ticket.ticket_number END desc,CASE WHEN (ticket.title LIKE '%" . $string ."%') THEN ticket.title END desc, CASE WHEN ( ticket.content LIKE '%" . $string ."%') THEN ticket.content END desc, CASE WHEN (ticketevent.type = 'COMMENT' and ticketevent.content LIKE '%".$string."%') THEN ticketevent.content END desc," ;
        }
    }

}

