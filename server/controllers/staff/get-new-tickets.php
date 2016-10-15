<?php
use Respect\Validation\Validator as DataValidator;

class GetNewTicketsStaffControllers extends Controller {
    const PATH = '/get-new-tickets';

    public function validations() {
        return[
            'permission' => 'staff_1',
            'requestData' => []
        ];
    }

    public function handler() {

    }
}