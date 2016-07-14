<?php
class MailTemplate extends DataStore {
    const TABLE = 'mailtemplate';
    
    const USER_SIGNUP = 'USER_SIGNUP';
    const USER_PASSWORD = 'USER_PASSWORD';
    
    public static function getTemplate($type) {
        //TODO: Add initial mails templates to the database
        //return MailTemplate::getDataStore($type, 'type');

        $template = new MailTemplate();
        $template->setProperties([
            'type' => $type,
            'subject' => 'Test Subject for {{to}}',
            'body' => 'Test body for {{to}}'
        ]);
        return $template;
    }
    
    public static function getProps() {
        return [
            'type',
            'subject',
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