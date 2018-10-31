<?php
require_once 'libs/MailTexts.php';

class InitialMails {

    public static function getBody($templateCode, $texts) {
      $templateFilePaths = [
        'USER_SIGNUP' => 'data/mail-templates/user-signup.html',
        'USER_PASSWORD' => 'data/mail-templates/user-edit-password.html',
        'USER_EMAIL' => 'data/mail-templates/user-edit-email.html',
        'PASSWORD_FORGOT' => 'data/mail-templates/user-password-forgot.html',
        'USER_SYSTEM_DISABLED' => 'data/mail-templates/user-system-disabled.html',
        'USER_SYSTEM_ENABLED' => 'data/mail-templates/user-system-enabled.html',
        'TICKET_CREATED' => 'data/mail-templates/ticket-created.html',
        'TICKET_RESPONDED' => 'data/mail-templates/ticket-responded.html',
        'TICKET_CLOSED' => 'data/mail-templates/ticket-closed.html',
        'TICKET_CREATED_STAFF' => 'data/mail-templates/ticket-created-staff.html',
      ];
      array_shift($texts);

      $matches = [];
      foreach($texts as $key => $val) {
          $matches[] = '{{' . $templateCode . '_MATCH_' . ($key + 1) . '}}';
      }

      return str_replace($matches, $texts, file_get_contents($templateFilePaths[$templateCode]));
    }

    public static function generateTemplateTexts($templateCode) {
      $mailTexts = MailTexts::getTexts();
      $templateTexts = [];

      foreach($mailTexts as $language => $languageTexts) {
          $templateTexts[$language] = [
              'subject' => $languageTexts[$templateCode][0],
              'body' => InitialMails::getBody($templateCode, $languageTexts[$templateCode]),
          ];
      }

      return $templateTexts;
    }

    public static function retrieve() {
        return [
            'USER_SIGNUP' => InitialMails::generateTemplateTexts('USER_SIGNUP'),
            'USER_PASSWORD' => InitialMails::generateTemplateTexts('USER_PASSWORD'),
            'USER_EMAIL' => InitialMails::generateTemplateTexts('USER_EMAIL'),
            'PASSWORD_FORGOT' => InitialMails::generateTemplateTexts('PASSWORD_FORGOT'),
            'USER_SYSTEM_DISABLED' => InitialMails::generateTemplateTexts('USER_SYSTEM_DISABLED'),
            'USER_SYSTEM_ENABLED' => InitialMails::generateTemplateTexts('USER_SYSTEM_ENABLED'),
            'TICKET_CREATED' => InitialMails::generateTemplateTexts('TICKET_CREATED'),
            'TICKET_RESPONDED' => InitialMails::generateTemplateTexts('TICKET_RESPONDED'),
            'TICKET_CLOSED' => InitialMails::generateTemplateTexts('TICKET_CLOSED'),
            'TICKET_CREATED_STAFF' => InitialMails::generateTemplateTexts('TICKET_CREATED_STAFF'),
        ];
    }
}
