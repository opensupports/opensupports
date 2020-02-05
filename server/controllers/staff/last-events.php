<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /staff/last-events Get last events
 * @apiVersion 4.6.1
 *
 * @apiName Get last events
 *
 * @apiGroup Staff
 *
 * @apiDescription This path retrieves the last events.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} page The page number.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PAGE
 *
 * @apiSuccess {[TicketEvent](#api-Data_Structures-ObjectTicketevent)[]} data Array of last events
 *
 */

class LastEventsStaffController extends Controller {
    const PATH = '/last-events';
    const METHOD = 'POST';

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

        if(Ticketevent::count() && !$user->sharedTicketList->isEmpty()) {
            $eventList = Ticketevent::find($query, [10, 10*($page-1)]);
            Response::respondSuccess($eventList->toArray());
        } else {
            Response::respondSuccess([]);
        }
    }
}
