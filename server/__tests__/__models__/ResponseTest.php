<?php
include_once '__tests__/__lib__/Mock.php';
include_once '__tests__/__mocks__/SlimMock.php';
include_once 'models/Response.php';

//use \Mockery as Mockery;

class ResponseTest extends PHPUnit_Framework_TestCase {
    public function testErrorResponseFormat() {
        //Mock data
        $mockErrorValue = 'MOCK_ERROR_VALUE';
        $mockData = array('example' => true);
        $expectedArgument = json_encode(array(
            'status' => 'fail',
            'message' => $mockErrorValue,
            'data' => $mockData
        ));
        $responseInstance = \Slim\Slim::getInstance()->response();

        //Execute Response
        Response::respondError($mockErrorValue, $mockData);

        //Should have been called with expected format
        $this->assertTrue($responseInstance->setBody->hasBeenCalledWithArgs($expectedArgument));
    }

    public function testErrorResponseFormatWithoutData() {
        //Mock data
        $mockErrorValue = 'MOCK_ERROR_VALUE';
        $expectedArgument = json_encode(array(
            'status' => 'fail',
            'message' => $mockErrorValue,
            'data' => null
        ));
        $responseInstance = \Slim\Slim::getInstance()->response();

        //Execute Response
        Response::respondError($mockErrorValue);

        //Should have been called with expected format
        $this->assertTrue($responseInstance->setBody->hasBeenCalledWithArgs($expectedArgument));
    }

    public function testSuccessFormat() {
        //Mock data
        $mockData = array('example' => true);
        $expectedArgument = json_encode(array(
            'status' => 'success',
            'data' => $mockData
        ));
        $responseInstance = \Slim\Slim::getInstance()->response();

        //Execute Response
        Response::respondSuccess($mockData);

        //Should have been called with expected format
        $this->assertTrue($responseInstance->setBody->hasBeenCalledWithArgs($expectedArgument));
    }

    public function testSuccessFormatWithoutData() {
        //Mock data
        $expectedArgument = json_encode(array(
            'status' => 'success',
            'data' => null
        ));
        $responseInstance = \Slim\Slim::getInstance()->response();

        //Execute Response
        Response::respondSuccess();

        //Should have been called with expected format
        $this->assertTrue($responseInstance->setBody->hasBeenCalledWithArgs($expectedArgument));
    }
}
