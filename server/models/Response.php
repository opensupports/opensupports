<?php
class Response {

    public static function respondError($errorMsg, $data = null) {
        $response = array(
            'status' => 'fail',
            'session_id' => session_id(),
            'message' => $errorMsg,
            'data' => $data
        );

        $app = \Slim\Slim::getInstance();
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($response));
        $app->response->finalize();
    }

    public static function respondSuccess($data = null) {
        $response = array(
            'status' => 'success',
            'session_id' => session_id(),
            'data' => $data
        );

        $app = \Slim\Slim::getInstance();
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($response));
        $app->response->finalize();
    }

    public static function respond403() {
        $app = \Slim\Slim::getInstance();
        $app->response->setStatus(403);
        $app->response->finalize();
    }

    public static function getResponse() {

    }
}
