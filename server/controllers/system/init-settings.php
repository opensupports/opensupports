<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class InitSettingsController extends Controller {
    const PATH = '/init-settings';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => [
                'language' => [
                    'validation' => DataValidator::validLanguage(),
                    'error' => ERRORS::INVALID_LANGUAGE
                ]
            ]
        ];
    }

    public function handler() {
        if (Setting::isTableEmpty()) {
            $this->storeGlobalSettings();
            $this->storeMailTemplates();
            $this->storeLanguages();
            $this->storeMockedDepartments();

            Response::respondSuccess();
        } else {
            Response::respondError(ERRORS::INIT_SETTINGS_DONE);
        }
    }

    private function storeGlobalSettings() {
        $this->storeSettings([
            'language' => Controller::request('language'),
            'recaptcha-public' => '',
            'recaptcha-private' => '',
            'no-reply-email' => 'noreply@opensupports.com',
            'smtp-host' => 'localhost',
            'smtp-port' => 7070,
            'smtp-user' => '',
            'smtp-pass' => '',
            'time-zone' => 0,
            'maintenance-mode' => 0,
            'layout' => 'boxed',
            'allow-attachments' => 0,
            'max-size' => 1024,
            'title' => 'Support Center',
            'url' => 'http://' . $_SERVER['HTTP_HOST'],
            'registration' => !!Controller::request('registration'),
            'user-system-enabled' => !!Controller::request('user-system-enabled'),
            'last-stat-day' => date('YmdHi', strtotime(' -12 day ')),
            'ticket-gap' => Hashing::generateRandomPrime(1000000, 9999999),
            'file-gap' => Hashing::generateRandomPrime(1000000, 9999999),
            'file-first-number' => Hashing::generateRandomNumber(1000000, 9999999),
            'file-quantity' => 0
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
    private function storeLanguages() {
        foreach(Language::LANGUAGES as $languageCode) {
            $language = new Language();
            $language->setProperties([
                'code' => $languageCode,
                'allowed' => 1,
                'supported' => ($languageCode === 'en')
            ]);

            $language->store();
        }
    }

    private function storeMockedDepartments() {
        $departments = [
            'Help and Support'
        ];

        foreach ($departments as $departmentName) {
            $department = new Department();
            $department->name = $departmentName;
            $department->store();
        }
    }
}
