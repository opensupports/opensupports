<?php
// MOCKS
include_once 'tests/__lib__/Mock.php';
include_once 'tests/__mocks__/NullDataStoreMock.php';
include_once 'tests/__mocks__/ResponseMock.php';
include_once 'tests/__mocks__/ControllerMock.php';
include_once 'tests/__mocks__/SessionMock.php';
include_once 'tests/__mocks__/UserMock.php';
include_once 'tests/__mocks__/HashingMock.php';
include_once 'tests/__mocks__/SessionCookieMock.php';
include_once 'tests/__mocks__/RedBeanMock.php';
include_once 'data/ERRORS.php';

use PHPUnit\Framework\TestCase;

class LoginControllerTest extends TestCase {
    private $loginController;

    protected function setUp() {
        Session::initStubs();
        User::initStubs();
        Response::initStubs();
        $_SERVER['REMOTE_ADDR'] = 'MOCK_REMOTE';

        $this->loginController = new LoginController();
    }

    public function testShouldCreateSessionAndRespondSuccessIfCredentialsAreValid() {
        Session::mockInstanceFunction('sessionExists', \Mock::stub()->returns(false));
        Controller::useValueReturn();

        $this->loginController->handler();
        $this->assertTrue(!!Session::getInstance()->createSession->hasBeenCalledWithArgs('MOCK_ID', false));
        $this->assertTrue(Response::get('respondSuccess')->hasBeenCalledWithArgs(array(
            'userId' => 'MOCK_ID',
            'userEmail' => 'MOCK_EMAIL',
            'staff' => false,
            'token' => 'TEST_TOKEN',
            'rememberToken' => null,
            'rememberExpiration' => Date::getNextDate(30)
        )));
    }

    public function testShouldRespondErrorIfCredentialsAreInvalid() {
        User::setStatics(array(
            'authenticate' => \Mock::stub()->returns(new NullDataStore())
        ));

        Controller::$requestReturnMock = '';

        $this->expectExceptionMessage(ERRORS::INVALID_CREDENTIALS);

        $this->loginController->handler();
    }
}
