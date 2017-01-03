<?php
use Respect\Validation\Validator as DataValidator;

class EditMailController extends Controller {
    const PATH = '/edit-mail';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }

    public function handler() {
        Response::respondSuccess();

    }
}