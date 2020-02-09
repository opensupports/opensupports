<?php
class Response {
    private static $response;
    private static $responseException;
    private static $failed;
    private static $called = false;

    public static function respondError($errorMsg, $exception = null, $data = null) {
        self::$called = true;
        self::$failed = true;
        self::$response = array(
            'status' => 'fail',
            'session_id' => session_id(),
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
        self::$called = true;
        self::$failed = false;
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

    public static function isErrored() {
        return self::$failed;
    }

    public static function isExceptionExpected() {
        return self::$responseException instanceOf RequestException;
    }

    public static function getException() {
        return self::$responseException;
    }

    public static function getResponse() {
        return self::$response;
    }

    public static function hasBeenCalled() {
        return self::$called;
    }
}
