<?php

class CheckSessionController extends Controller {
    const PATH = '/check-session';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        $session = Session::getInstance();

        Response::respondSuccess([
            'sessionActive' => $session->sessionExists()
        ]);
    }
}
