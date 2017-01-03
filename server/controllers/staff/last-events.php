<?php
use Respect\Validation\Validator as DataValidator;

class LastEventsStaffController extends Controller {
    const PATH = '/last-events';

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
        $page = Controller::request('page');

        $user = Controller::getLoggedUser();
        $query = ' (';
        foreach ($user->sharedTicketList as $ticket) {
            $query .= 'ticket_id =' . $ticket->id . ' OR ';
        }
        $query = substr($query,0,-3);
        $query .= ') ORDER BY id desc LIMIT ? OFFSET ?' ;

        $eventList = Ticketevent::find($query, [10, 10*($page-1)+1]);

        Response::respondSuccess($eventList->toArray());
    }
}