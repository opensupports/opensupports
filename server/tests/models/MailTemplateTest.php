<?php
include_once 'tests/__lib__/Mock.php';
include_once 'tests/__mocks__/BeanMock.php';
include_once 'tests/__mocks__/SettingMock.php';
include_once 'tests/__mocks__/RedBeanMock.php';
include_once 'models/MailTemplate.php';

use RedBeanPHP\Facade as RedBean;
use PHPUnit\Framework\TestCase;

class MailTemplateTest extends TestCase {

    protected function setUp() {
        RedBean::initStubs();
        Setting::initStubs();

        RedBean::setStatics([
            'findOne' => \Mock::stub()->returns($this->getMockTemplateBean())
        ]);
    }

    public function testGetTemplateShouldReturnSpecifiedTemplate() {
        $mailTemplate = MailTemplate::getTemplate(MailTemplate::USER_SIGNUP);

        $this->assertEquals('TEST_TYPE', $mailTemplate->type);
        $this->assertTrue(Redbean::get('findOne')->hasBeenCalledWithArgs('mailtemplate', 'type = :type AND language = :language', array(
            ':type'  => 'USER_SIGNUP',
            ':language' => 'MOCK_SETTING_VALUE'
        )));
    }

    public function testCompilation() {
        $mailTemplate = new MailTemplate();
        $mailTemplate->setProperties([
            'subject' => 'Welcoming to {{to}}',
            'body' => 'Welcome, {{userName}} to our team'
        ]);

        $result = $mailTemplate->compile([
            'to' => 'cersei@opensupports.com',
            'userName' => 'Cersei Lannister',
        ]);

        $this->assertEquals($result['subject'], 'Welcoming to cersei@opensupports.com');
        $this->assertEquals($result['body'], 'Welcome, Cersei Lannister to our team');
    }

    private function getMockTemplateBean() {
        $mailTemplateBean = new BeanMock();
        $mailTemplateBean->type = 'TEST_TYPE';
        $mailTemplateBean->body = 'Some body';
        $mailTemplateBean->subject = 'Some subject';
        $mailTemplateBean->language = 'en';

        return $mailTemplateBean;
    }
}
