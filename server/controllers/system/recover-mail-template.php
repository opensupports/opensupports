<?php
use Respect\Validation\Validator as DataValidator;

class RecoverMailTemplateController extends Controller {
    const PATH = '/recover-mail-template';

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