<?php
class Response {
    private static $errored;

    public static function respondError($errorMsg, $data = null) {
        $response = array(
            'status' => 'fail',
            'message' => $errorMsg,
            'data' => $data
        );

        $app = \Slim\Slim::getInstance();
        $app->response()->setBody(json_encode($response));
    }

    public static function respondSuccess($data = null) {
        $response = array(
            'status' => 'success',
            'data' => $data
        );

        $app = \Slim\Slim::getInstance();
        $app->response()->setBody(json_encode($response));
    }
}
