<?php
include_once 'tests/__mocks__/RespectMock.php';
include_once 'tests/__mocks__/SettingMock.php';
include_once 'tests/__mocks__/APIKeyMock.php';
include_once 'tests/__mocks__/ControllerMock.php';
include_once 'tests/__mocks__/ReCaptchaMock.php';

use PHPUnit\Framework\TestCase;

class CaptchaValidationTest extends TestCase {

    protected function setUp() {
        Setting::initStubs();
        APIKey::initStubs();
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
