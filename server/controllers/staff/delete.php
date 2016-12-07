<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class DeleteStaffController extends Controller {
    const PATH = '/delete';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'staffId' => [
                    'validation' => DataValidator::dataStoreId('staff'),
                    'error' => ERRORS::INVALID_STAFF
                ]
            ]
        ];
    }

    public function handler() {
        $staffId = Controller::request('staffId');
        $staff = Staff::getDataStore($staffId);

        foreach($staff->sharedTicketList as $ticket) {
            $ticket->owner = null;
            $ticket->unread = true;
            $ticket->store();
        }

        $staff->delete();
        Response::respondSuccess();
    }
    
}