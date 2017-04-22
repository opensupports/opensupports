<?php
use RedBeanPHP\Facade as RedBean;

/**
 * @api {OBJECT} MailTemplate MailTemplate
 * @apiGroup Data Structures
 * @apiParam {String} type The type of the mail template.
 * @apiParam {String} subject The subject of the mail template.
 * @apiParam {string} language The language of the mail template.
 * @apiParam {String} body The body of the mail template.
 */

class MailTemplate extends DataStore {
    const TABLE = 'mailtemplate';
    
    const USER_SIGNUP = 'USER_SIGNUP';
    const USER_PASSWORD = 'USER_PASSWORD';
    const PASSWORD_FORGOT = 'PASSWORD_FORGOT';
    const USER_SYSTEM_DISABLED = 'USER_SYSTEM_DISABLED';
    const USER_SYSTEM_ENABLED = 'USER_SYSTEM_ENABLED';
    const TICKET_CREATED = 'TICKET_CREATED';
    const TICKET_RESPONDED = 'TICKET_RESPONDED';
    const TICKET_CLOSED = 'TICKET_CLOSED';

    public static function getTemplate($type) {
        $globalLanguage = Setting::getSetting('language')->value;
        
        $bean = RedBean::findOne(MailTemplate::TABLE, 'type = :type AND language = :language', array(
            ':type'  => $type,
            ':language' => $globalLanguage
        ));

        return ($bean) ? new MailTemplate($bean) : new NullDataStore();
    }
    
    public static function getProps() {
        return [
            'type',
            'subject',
            'language',
            'body'
        ];
    }

    public function compile($config) {
        return [
            'body' => $this->compileString($this->body, $config),
            'subject' => $this->compileString($this->subject, $config),
            'to' => $config['to']
        ];
    }
    
    public function compileString($string, $config) {
        $compiledString = $string;

        foreach ($config as $configName => $configValue) {
            $compiledString = str_replace("{{{$configName}}}", $configValue, $compiledString);
        }

        return $compiledString;
    }
    public function toArray() {
        return [
            'type' => $this->type,
            'subject' => $this->subject,
            'language' => $this->language,
            'body' => $this->body,
        ];
    }
}