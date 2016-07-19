<?php
// MOCKS
include_once 'tests/__lib__/Mock.php';
include_once 'tests/__mocks__/ResponseMock.php';
include_once 'tests/__mocks__/ControllerMock.php';
include_once 'tests/__mocks__/SessionMock.php';
include_once 'tests/__mocks__/UserMock.php';
include_once 'models/ERRORS.php';

include_once 'controllers/user/login.php';

class LoginControllerTest extends PHPUnit_Framework_TestCase {
    private $loginController;

    protected function setUp() {
        Session::initStubs();
        Controller::initStubs();
        User::initStubs();
        Response::initStubs();

        $this->loginController = new LoginController();
    }

    public function testShouldRespondErrorIfAlreadyLoggedIn() {
        Session::mockInstanceFunction('sessionExists', \Mock::stub()->returns(true));

        $this->loginController->handler();

        $this->assertTrue(Response::get('respondError')->hasBeenCalledWithArgs(ERRORS::SESSION_EXISTS));
    }

    public function testShouldCreateSessionAndRespondSuccessIfCredentialsAreValid() {
        Session::mockInstanceFunction('sessionExists', \Mock::stub()->returns(false));

        $this->loginController->handler();

        $this->assertTrue(Session::getInstance()->createSession->hasBeenCalledWithArgs('MOCK_ID'));
        $this->assertTrue(Response::get('respondSuccess')->hasBeenCalledWithArgs(array(
            'userId' => 'MOCK_ID',
            'userEmail' => 'MOCK_EMAIL',
            'token' => 'TEST_TOKEN',
            'rememberToken' => null
        )));
    }

    public function testShouldRespondErrorIfCredentialsAreInvalid() {
        User::setStatics(array(
            'authenticate' => \Mock::stub()->returns(null)
        ));

        $this->loginController->handler();

        $this->assertTrue(Response::get('respondError')->hasBeenCalledWithArgs(ERRORS::INVALID_CREDENTIALS));
    }
}
