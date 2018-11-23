<?php
class Response {
    private static $response;
    private static $responseException;

    public static function respondError($errorMsg, $exception = null) {
        self::$response = array(
            'status' => 'fail',
            'session_id' => session_id(),
            'message' => $errorMsg,
            'data' => null
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
            'session_id' => session_id(),
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
