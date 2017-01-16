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
            $this->storeLanguages();
            $this->storeMockedDepartments();
            $this->createMockedStaff();

            Response::respondSuccess();
        } else {
            Response::respondError(ERRORS::INIT_SETTINGS_DONE);
        }
    }

    private function storeGlobalSettings() {
        $this->storeSettings([
            'language' => 'en',
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
            'max-size' => 0,
            'title' => 'Support Center',
            'url' => 'http://www.opensupports.com/support',
            'registration' => true,
            'user-system-enabled' => true
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
            'Tech Support',
            'Suggestions',
            'Sales and Subscriptions'
        ];

        foreach ($departments as $departmentName) {
            $department = new Department();
            $department->name = $departmentName;
            $department->store();
        }
    }

    private function createMockedStaff() {
        $staff = new Staff();
        $staff->setProperties([
            'name' => 'Emilia Clarke',
            'email' => 'staff@opensupports.com',
            'password' => Hashing::hashPassword('staff'),
            'profilePic' => 'http://www.opensupports.com/profilepic.jpg',
            'level' => 3,
            'sharedDepartmentList' => Department::getAll(),
            'sharedTicketList' => []
        ]);
        foreach(Department::getAll() as $department) {
            $department->owners++;
            $department->store();
        }
        $staff->store();
    }
}