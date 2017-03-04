<?php
use Respect\Validation\Validator as DataValidator;

class GetAPIKeysController extends Controller {
    const PATH = '/get-api-keys';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }

    public function handler() {
        $apiList = APIKey::getAll();
        
        Response::respondSuccess($apiList->toArray());
    }
}