<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /staff/get-all-tickets Retrieve all tickets.
 *
 * @apiName Get all tickets
 *
 * @apiGroup staff
 *
 * @apiDescription This path retrieves all tickets created.
 *
 * @apiPermission Staff level 1
 *
 * @apiParam {Number} page The page's number that it's looking for.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PAGE
 *
 * @apiSuccess {Object} data Information about a tickets and quantity of pages
 * @apiSuccess {[Ticket](#api-Data_Structures-ObjectTicket)[]} data.tickets Array of tickets of the current page
 * @apiSuccess {Number} data.pages Quantity of pages
 *
 */

class GetAllTicketsStaffController extends Controller {
    const PATH = '/get-all-tickets';
    const METHOD = 'POST';

    public function validations() {
        return[
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
            'tickets' => $this->getTicketList()->toArray(),
            'pages' => $this->getTotalPages()
        ]);
    }

    private function getTicketList() {
        $page = Controller::request('page');

        $query = $this->getStaffDepartmentsQueryFilter();
        $query .= 'ORDER BY id DESC LIMIT 10 OFFSET ' . (($page-1)*10);

        return Ticket::find($query);
    }

    private function getTotalPages() {
        $query = $this->getStaffDepartmentsQueryFilter();

        return ceil(Ticket::count($query) / 10);
    }

    private function getStaffDepartmentsQueryFilter() {
        $user = Controller::getLoggedUser();

        $query = ' (';
        foreach ($user->sharedDepartmentList as $department) {
            $query .= 'department_id=' . $department->id . ' OR ';
        }
        $query = substr($query,0,-3);
        $query .= ') ';

        return $query;
    }
}