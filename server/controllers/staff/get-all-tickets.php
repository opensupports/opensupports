<?php
use Respect\Validation\Validator as DataValidator;

class GetAllTicketsStaffController extends Controller {
    const PATH = '/get-all-tickets';

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