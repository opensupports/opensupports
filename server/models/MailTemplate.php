<?php
use RedBeanPHP\Facade as RedBean;

/**
 * @api {OBJECT} MailTemplate MailTemplate
 * @apiVersion 4.6.1
 * @apiGroup Data Structures
 * @apiParam {String} type The type of the mail template.
 * @apiParam {String} subject The subject of the mail template.
 * @apiParam {string} language The language of the mail template.
 * @apiParam {String} text1 First paragraph of the mail template.
 * @apiParam {String} text2 Second paragraph of the mail template.
 * @apiParam {String} text3 Thrid paragraph of the mail template.
 */

class MailTemplate extends DataStore {
    const TABLE = 'mailtemplate';

    const USER_SIGNUP = 'USER_SIGNUP';
    const USER_PASSWORD = 'USER_PASSWORD';
    const PASSWORD_FORGOT = 'PASSWORD_FORGOT';
    const USER_INVITE = 'USER_INVITE';
    const USER_SYSTEM_DISABLED = 'USER_SYSTEM_DISABLED';
    const USER_SYSTEM_ENABLED = 'USER_SYSTEM_ENABLED';
    const TICKET_CREATED = 'TICKET_CREATED';
    const TICKET_RESPONDED = 'TICKET_RESPONDED';
    const TICKET_CLOSED = 'TICKET_CLOSED';
    const TICKET_CREATED_STAFF = 'TICKET_CREATED_STAFF';

    public static function getFilePaths() {
        return [
          'USER_SIGNUP' => 'data/mail-templates/user-signup.html',
          'USER_PASSWORD' => 'data/mail-templates/user-edit-password.html',
          'USER_EMAIL' => 'data/mail-templates/user-edit-email.html',
          'PASSWORD_FORGOT' => 'data/mail-templates/user-password-forgot.html',
          'USER_INVITE' => 'data/mail-templates/user-invite.html',
          'USER_SYSTEM_DISABLED' => 'data/mail-templates/user-system-disabled.html',
          'USER_SYSTEM_ENABLED' => 'data/mail-templates/user-system-enabled.html',
          'TICKET_CREATED' => 'data/mail-templates/ticket-created.html',
          'TICKET_RESPONDED' => 'data/mail-templates/ticket-responded.html',
          'TICKET_CLOSED' => 'data/mail-templates/ticket-closed.html',
          'TICKET_CREATED_STAFF' => 'data/mail-templates/ticket-created-staff.html',
      ];
    }

    public static function getMailTemplate($template) {
        $globalLanguage = Setting::getSetting('language')->value;

        $bean = RedBean::findOne(MailTemplate::TABLE, 'template = :template AND language = :language', array(
            ':template'  => $template,
            ':language' => $globalLanguage
        ));

        return ($bean) ? new MailTemplate($bean) : new NullDataStore();
    }

    public static function getProps() {
        return [
            'template',
            'subject',
            'language',
            'text1',
            'text2',
            'text3',
        ];
    }

    public function getSubject($config) {
        return $this->compileString($this->subject, $config);
    }

    public function getBody($config) {
      $templateFilePaths = MailTemplate::getFilePaths();
      $texts = [
          $this->text1, $this->text2, $this->text3, $this->text4,
      ];

      $matches = [];
      foreach($texts as $key => $val) {
          $matches[] = '{{' . $this->template . '_MATCH_' . ($key + 1) . '}}';
      }

      $matches[] = '{{IMAGE_HEADER_URL}}';
      $texts[] = Setting::getSetting('mail-template-header-image')->value;

      $body = str_replace($matches, $texts, file_get_contents($templateFilePaths[$this->template]));

      return $this->compileString($body, $config);
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
            'template' => $this->template,
            'subject' => $this->subject,
            'language' => $this->language,
            'text1' => $this->text1,
            'text2' => $this->text2,
            'text3' => $this->text3,
        ];
    }
}
