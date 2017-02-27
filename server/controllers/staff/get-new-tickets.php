<?php
use Respect\Validation\Validator as DataValidator;

class GetNewTicketsStaffController extends Controller {
    const PATH = '/get-new-tickets';
    const METHOD = 'POST';

    public function validations() {
        return[
            'permission' => 'staff_1',
            'requestData' => []
        ];
    }
    public function handler() {
        $user = Controller::getLoggedUser();
        $query = ' (';
        foreach ($user->sharedDepartmentList as $department) {
            $query .= 'department_id=' . $department->id . ' OR ';
        }
        $query = substr($query,0,-3);
        $query .= ') AND owner_id IS NULL';
        
        $ticketList = Ticket::find($query);
        
        Response::respondSuccess($ticketList->toArray());
    }
}