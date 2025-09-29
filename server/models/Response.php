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

        // CORS 헤더 추가
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Content-Type: application/json');
        echo json_encode(self::$response);
        exit();
    }

    public static function respondSuccess($data = null) {
        self::$response = array(
            'status' => 'success',
            'data' => $data
        );

        // CORS 헤더 추가
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Content-Type: application/json');
        echo json_encode(self::$response);
        exit();
    }

    public static function respond403() {
        // CORS 헤더 추가
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        http_response_code(403);
        exit();
    }
}
