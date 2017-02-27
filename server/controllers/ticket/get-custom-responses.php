<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class GetCustomResponsesController extends Controller {
    const PATH = '/get-custom-responses';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => []
        ];
    }

    public function handler() {
        $customResponsesList = CustomResponse::getAll();
        
        Response::respondSuccess($customResponsesList->toArray());
    }
}