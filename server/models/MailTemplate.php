<?php
use RedBeanPHP\Facade as RedBean;

class MailTemplate extends DataStore {
    const TABLE = 'mailtemplate';
    
    const USER_SIGNUP = 'USER_SIGNUP';
    const USER_PASSWORD = 'USER_PASSWORD';
    
    public static function getTemplate($type) {
        $globalLanguage = Setting::getSetting('language');
        
        $bean = RedBean::findOne(MailTemplate::TABLE, 'type = :type AND language = :language', array(
            ':type'  => $type,
            ':language' => $globalLanguage
        ));

        return ($bean) ? new MailTemplate($bean) : null;
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
}