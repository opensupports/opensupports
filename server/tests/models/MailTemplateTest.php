<?php
include_once 'tests/__lib__/Mock.php';
include_once 'models/MailTemplate.php';

class MailTemplateTest extends PHPUnit_Framework_TestCase {
    public function testGetTemplateShouldReturnSpecifiedTemplate() {
        $mailTemplate = MailTemplate::getTemplate(MailTemplate::USER_SIGNUP);
        
        $this->assertEquals(MailTemplate::USER_SIGNUP, $mailTemplate->type);
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
}
