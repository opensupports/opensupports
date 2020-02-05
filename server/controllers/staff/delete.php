<?php
use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;

/**
 * @api {post} /staff/delete Delete staff
 * @apiVersion 4.6.1
 *
 * @apiName Delete staff
 *
 * @apiGroup Staff
 *
 * @apiDescription This path deletes a staff member.
 *
 * @apiPermission staff3
 *
 * @apiParam {Number} staffId The id of the staff member.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_STAFF
 *
 * @apiSuccess {Object} data Empty object
 *
 */

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
            throw new RequestException(ERRORS::INVALID_STAFF);
            return;
        }

        foreach($staff->sharedTicketList as $ticket) {
            $ticket->owner = null;
            $ticket->unreadStaff  = true;
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
