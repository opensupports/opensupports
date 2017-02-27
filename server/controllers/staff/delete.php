<?php
use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;

DataValidator::with('CustomValidations', true);

class DeleteStaffController extends Controller {
    const PATH = '/delete';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'staffId' =>[
                    'validation' => DataValidator::dataStoreId('staff'),
                    'error' => ERRORS::INVALID_STAFF
                ]
            ]
        ];
    }

    public function handler() {
        $staffId = Controller::request('staffId');
        $staff = Staff::getDataStore($staffId);

        if($staffId === Controller::getLoggedUser()->id) {
            Response::respondError(ERRORS::INVALID_STAFF);
            return;
        }

        foreach($staff->sharedTicketList as $ticket) {
            $ticket->owner = null;
            $ticket->true  = true;
            $ticket->store();
        }
            
        foreach($staff->sharedDepartmentList as $department) {
            $department->owners--;
            $department->store();
        }
        
        RedBean::exec('DELETE FROM log WHERE author_staff_id = ?', [$staffId]);
        $staff->delete();
        Response::respondSuccess();
    }
    
}