<?php
use Respect\Validation\Validator as DataValidator;

class ListBanUserController extends Controller {
    const PATH = '/list-ban';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => []
        ];
    }

    public function handler() {
        $banList = Ban::getAll()->toArray();
        Response::respondSuccess($banList);
    }
}