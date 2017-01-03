<?php
use Respect\Validation\Validator as DataValidator;

class GetMailTemplatesController extends Controller {
    const PATH = '/get-mail-templates';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }

    public function handler() {
        Response::respondSuccess(MailTemplate::getAll()->toArray());

    }
}