<?php
class Response {

    public static function respondError($errorMsg, $data = null) {
        $response = array(
            'status' => 'fail',
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
            'data' => $data
        );

        $app = \Slim\Slim::getInstance();
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($response));
        $app->response->finalize();
    }
}
