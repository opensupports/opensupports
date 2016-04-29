<?php
class LogoutController extends Controller {
    const PATH = '/logout';

    public function handler() {
        $session = Session::getInstance();
        $session->closeSession();

        Response::respondSuccess();
    }
}