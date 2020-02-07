<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /staff/search-tickets Search tickets
 * @apiVersion 4.6.1
 *
 * @apiName Search tickets
 *
 * @apiGroup Staff
 *
 * @apiDescription This path search some tickets.
 *
 * @apiPermission staff1
 *
 * @apiParam {String} query Query string to search.
 * @apiParam {Number} page The page number.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_QUERY
 * @apiUse INVALID_PAGE
 *
 * @apiSuccess {Object} data Information about tickets
 * @apiSuccess {[Ticket](#api-Data_Structures-ObjectTicket)[]} data.tickets Array of tickets found
 * @apiSuccess {Number} data.pages Number of pages
 *
 */

class SearchTicketStaffController extends Controller {
    const PATH = '/search-tickets';
    const METHOD = 'POST';

    public function validations() {
        return[
            'permission' => 'staff_1',
            'requestData' => [
                'query' => [
                    'validation' => DataValidator::notBlank()->length(1),
                    'error' => ERRORS::INVALID_QUERY
                ],
                'page' => [
                    'validation' => DataValidator::numeric(),
                    'error' => ERRORS::INVALID_PAGE
                ]
            ]
        ];
    }

    public function handler() {
        Response::respondSuccess([
            'tickets' => $this->getTicketList()->toArray(),
            'pages' => $this->getTotalPages()
        ]);
    }

    private function getTicketList() {
        $query = $this->getSearchQuery();

        return Ticket::find($query, [
            Controller::request('query') . '%',
            '%' . Controller::request('query') . '%',
            Controller::request('query') . '%'
        ]);
    }

    private function getSearchQuery() {
        $page = Controller::request('page');

        $query = " (title LIKE ? OR title LIKE ?) AND ";
        $query .= $this->getStaffDepartmentsQueryFilter();
        $query .= "ORDER BY CASE WHEN (title LIKE ?) THEN 1 ELSE 2 END ASC LIMIT 10 OFFSET " . (($page-1)*10);

        return $query;
    }

    private function getTotalPages() {
        $query = " (title LIKE ? OR title LIKE ?) AND ";
        $query .= $this->getStaffDepartmentsQueryFilter();

        $ticketQuantity = Ticket::count($query, [
            Controller::request('query') . '%',
            '%' . Controller::request('query') . '%'
        ]);

        return ceil($ticketQuantity / 10);
    }

    private function getStaffDepartmentsQueryFilter() {
        $user = Controller::getLoggedUser();

        $query = ' (';
        foreach ($user->sharedDepartmentList as $department) {
            $query .= 'department_id=' . $department->id . ' OR ';
        }
        $query = substr($query, 0, -3);
        $query .= ') ';

        return $query;
    }
}