<?php
include_once 'tests/__lib__/Mock.php';
include_once 'tests/__mocks__/RespectMock.php';
include_once 'tests/__mocks__/SettingMock.php';
include_once 'tests/__mocks__/ReCaptchaMock.php';

include_once 'libs/validations/captcha.php';

class CaptchaValidationTest extends PHPUnit_Framework_TestCase {

    protected function setUp() {
        Setting::initStubs();
        \ReCaptcha\ReCaptcha::initVerify();

        $_SERVER['REMOTE_ADDR'] = 'MOCK_REMOTE';
    }

    public function testShouldReturnCorrectValue() {
        $captchaValidation = new \CustomValidations\Captcha();
        $response = $captchaValidation->validate('MOCK_RESPONSE');
        $this->assertTrue($response);

        \ReCaptcha\ReCaptcha::initVerify(false);
        $response = $captchaValidation->validate('MOCK_RESPONSE');
        $this->assertFalse($response);
    }
    
    public function testShouldPassCorrectValuesToCaptcha() {
        $captchaValidation = new \CustomValidations\Captcha();
        $captchaValidation->validate('MOCK_RESPONSE');

        $this->assertTrue(Setting::get('getSetting')->hasBeenCalledWithArgs('recaptcha-private'));
        $this->assertTrue(\ReCaptcha\ReCaptcha::$staticVerify->hasBeenCalledWithArgs('MOCK_RESPONSE', 'MOCK_REMOTE'));
    }
}