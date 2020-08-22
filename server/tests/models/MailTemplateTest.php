<?php
include_once 'tests/__lib__/Mock.php';
include_once 'tests/__mocks__/BeanMock.php';
include_once 'tests/__mocks__/SettingMock.php';
include_once 'tests/__mocks__/RedBeanMock.php';

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
        $mailTemplate = MailTemplate::getMailTemplate(MailTemplate::USER_SIGNUP);

        $this->assertEquals('USER_SIGNUP', $mailTemplate->type);
        $this->assertTrue(Redbean::get('findOne')->hasBeenCalledWithArgs('mailtemplate', 'template = :template AND language = :language', array(
            ':template'  => 'USER_SIGNUP',
            ':language' => 'MOCK_SETTING_VALUE'
        )));
    }

    public function testCompilation() {
        $mailTemplate = new MailTemplate();
        $mailTemplate->setProperties([
            'template' => 'USER_SIGNUP',
            'subject' => 'Welcoming to {{to}}',
            'text1' => 'Welcome, {{userName}} to our team'
        ]);

        $resultSubject = $mailTemplate->getSubject([
            'to' => 'cersei@opensupports.com',
            'userName' => 'Cersei Lannister',
        ]);

        $resultBody = $mailTemplate->getBody([
            'to' => 'cersei@opensupports.com',
            'userName' => 'Cersei Lannister',
        ]);

        $this->assertEquals('Welcoming to cersei@opensupports.com', $resultSubject);
        $this->assertContains('Welcome, Cersei Lannister to our team', $resultBody);
    }

    private function getMockTemplateBean() {
        $mailTemplateBean = new BeanMock();
        $mailTemplateBean->type = 'USER_SIGNUP';
        $mailTemplateBean->text1 = 'Text1';
        $mailTemplateBean->text2 = 'Text1';
        $mailTemplateBean->text3 = 'Text1';
        $mailTemplateBean->subject = 'Some subject';
        $mailTemplateBean->language = 'en';

        return $mailTemplateBean;
    }
}
