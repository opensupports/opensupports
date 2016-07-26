<?php

class InitSettingsController extends Controller {
    const PATH = '/init-settings';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        if (Setting::isTableEmpty()) {
            $this->storeGlobalSettings();
            $this->storeMailTemplates();

            Response::respondSuccess();
        } else {
            Response::respondError(ERRORS::INIT_SETTINGS_DONE);
        }
    }

    private function storeGlobalSettings() {
        $this->storeSettings([
            'language' => 'en'
        ]);
    }

    private function storeMailTemplates() {
        $mails = InitialMails::retrieve();
        
        foreach ($mails as $mailType => $mailLanguages) {
            foreach ($mailLanguages as $mailLanguage => $mailContent) {
                $mailTemplate = new MailTemplate();

                $mailTemplate->setProperties([
                    'type' => $mailType,
                    'language' => $mailLanguage,
                    'subject' => $mailContent['subject'],
                    'body' => $mailContent['body']
                ]);

                $mailTemplate->store();
            }
        }
    }

    private function storeSettings($settings) {
        foreach ($settings as $settingName => $settingValue) {
            $setting = new Setting();

            $setting->setProperties([
                'name' => $settingName,
                'value' => $settingValue
            ]);

            $setting->store();
        }
    }
}