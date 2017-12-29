<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/change-department Change department
 * @apiVersion 4.1.0
 *
 * @apiName Change department
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path changes the department of a ticket.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} ticketNumber The number of the ticket.
 * @apiParam {Number} departmentId The id of the new department of the ticket.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TICKET
 * @apiUse INVALID_DEPARTMENT
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class ChangeDepartmentController extends Controller {
    const PATH = '/change-department';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'ticketNumber' => [
                    'validation' => DataValidator::validTicketNumber(),
                    'error' => ERRORS::INVALID_TICKET
                ],
                'departmentId' => [
                    'validation' => DataValidator::dataStoreId('department'),
                    'error' => ERRORS::INVALID_DEPARTMENT
                ]
            ]
        ];
    }

    public function handler() {
        $ticketNumber = Controller::request('ticketNumber');
        $departmentId = Controller::request('departmentId');
        $ticket = Ticket::getByTicketNumber($ticketNumber);
        $department = Department::getDataStore($departmentId);
        $user = Controller::getLoggedUser();

        if($ticket->owner && $ticket->owner->id !== $user->id){
            Response::respondError(ERRORS::NO_PERMISSION);
            return;
        }

        $event = Ticketevent::getEvent(Ticketevent::DEPARTMENT_CHANGED);
        $event->setProperties(array(
            'authorStaff' => Controller::getLoggedUser(),
            'content' => $department->name,
            'date' => Date::getCurrentDate()
        ));
        $ticket->addEvent($event);
        $ticket->department = $department;
        $ticket->unread = true;
        if(!Controller::getLoggedUser()->sharedDepartmentList->includesId($department->id)) {
            $ticket->owner = null;
        }
        $ticket->store();

        Log::createLog('DEPARTMENT_CHANGED', $ticket->ticketNumber);

        Response::respondSuccess();
    }
}
