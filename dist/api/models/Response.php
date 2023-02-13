<?php
class Response {
    private static $response;
    private static $responseException;

    public static function respondError($errorMsg, $exception = null, $data = null) {
        self::$response = array(
            'status' => 'fail',
            'message' => $errorMsg,
            'data' => $data
        );
        self::$responseException = $exception;

        $app = \Slim\Slim::getInstance();
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode(self::$response));
        $app->response->finalize();
    }

    public static function respondSuccess($data = null) {
        self::$response = array(
            'status' => 'success',
            'data' => $data
        );

        $app = \Slim\Slim::getInstance();
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode(self::$response));
        $app->response->finalize();
    }

    public static function respond403() {
        $app = \Slim\Slim::getInstance();
        $app->response->setStatus(403);
        $app->response->finalize();
    }
}
