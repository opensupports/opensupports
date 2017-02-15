<?php
class LogoutController extends Controller {
    const PATH = '/logout';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        $session = Session::getInstance();
        $session->closeSession();

        Response::respondSuccess();
    }
}