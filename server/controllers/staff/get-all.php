<?php
use Respect\Validation\Validator as DataValidator;


class GetAllStaffController extends Controller {
    const PATH ='/get-all';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }


    public function handler() {
        $staffs = Staff::getAll();
        $staffArray = [];

        foreach($staffs as $staff) {
            $assignedTickets = 0;
            $closedTickets = 0;

            foreach ($staff->sharedTicketList as $ticket) {
                if($ticket->closed) $closedTickets++;
                else $assignedTickets++;
            }

            $staffArray[] = [
                'id' => $staff->id,
                'name' => $staff->name,
                'email' => $staff->email,
                'profilePic' => $staff->profilePic,
                'level' => $staff->level,
                'departments' => $staff->sharedDepartmentList->toArray(),
                'assignedTickets' => $assignedTickets,
                'closedTickets' => $closedTickets,
                'lastLogin' => $staff->lastLogin
            ];
        }

        Response::respondSuccess($staffArray);
    
    }
}