<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /staff/get-all-tickets Get all tickets according to search
 * @apiVersion 4.6.1
 *
 * @apiName Get all tickets
 *
 * @apiGroup Staff
 *
 * @apiDescription This path retrieves all tickets according to search and opened/closed filters.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} page The page number.
 * @apiParam {String} query Query string to search.
 * @apiParam {Boolean} closed Include closed tickets.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PAGE
 *
 * @apiSuccess {Object} data Information about a tickets and quantity of pages.
 * @apiSuccess {[Ticket](#api-Data_Structures-ObjectTicket)[]} data.tickets Array of tickets of the current page.
 * @apiSuccess {Number} data.pages Quantity of pages.
 *
 */

class GetAllTicketsStaffController extends Controller {
    const PATH = '/get-all-tickets';
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
        if (Ticket::isTableEmpty()) {
            Response::respondSuccess([
                'tickets' => [],
                'pages' => 0
            ]);
            return;
        }
        
        Response::respondSuccess([
            'tickets' => $this->getTicketList()->toArray(true),
            'pages' => $this->getTotalPages()
        ]);
    }

    private function getTicketList() {
        $page = Controller::request('page');

        $query = $this->getSearchQuery();
        $query .= $this->getStaffDepartmentsQueryFilter();
        $query .= $this->getClosedFilter();
        $query .= "ORDER BY CASE WHEN (title LIKE ?) THEN 1 ELSE 2 END ASC, id DESC LIMIT 10 OFFSET " . (($page-1)*10);
        
        return Ticket::find($query, [
            Controller::request('query') . '%',
            '%' . Controller::request('query') . '%',
            Controller::request('query') . '%'
        ]);
    }

    private function getSearchQuery() {
        $page = Controller::request('page');

        $query = " (title LIKE ? OR title LIKE ?) AND ";

        return $query;
    }

    private function getTotalPages() {
        $query = $this->getSearchQuery();
        $query .= $this->getStaffDepartmentsQueryFilter();
        $query .= $this->getClosedFilter();

        return ceil(Ticket::count($query, [
            Controller::request('query') . '%',
            '%' . Controller::request('query') . '%'
        ]) / 10);
    }

    private function getStaffDepartmentsQueryFilter() {
        $user = Controller::getLoggedUser();

        $query = ' (';
        foreach ($user->sharedDepartmentList as $department) {
            $query .= 'department_id=' . $department->id . ' OR ';
        }
        $query .= 'FALSE) ';

        return $query;
    }

    private function getClosedFilter() {
        $closed = Controller::request('closed')*1;
        if ($closed) {
            return '';
        } else {
            return " AND (closed = '0')";
        }
    }
}
