<?php
use RedBeanPHP\Facade as RedBean;
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /system/init-settings Init settings
 * @apiVersion 4.11.0
 *
 * @apiName Init settings
 *
 * @apiGroup System
 *
 * @apiDescription This path sets the initial settings. It can only be used once during installation.
 *
 * @apiPermission any
 *
 * @apiParam {String} language Indicates the default language of the system.
 * @apiParam {String} registration Indicates if the registration should be enabled.
 * @apiParam {String} server-email Email from where automated emails will be sent.
 * @apiParam {String} smtp-host SMTP Server address.
 * @apiParam {String} smtp-port SMTP Server port.
 * @apiParam {String} smtp-user SMTP Authentication User.
 * @apiParam {String} smtp-pass SMTP Authentication Password.
 * @apiParam {String} allow-attachments Indicates if files can be attached to tickets and comments.
 * @apiParam {String} title Title of the support center
 * @apiParam {String} url Url of the frontend client.
 * @apiParam {Boolean} mandatory-login Indicates if the login is mandatory.
 * @apiParam {Number} default-department-id Indicates the id of the default department
 * @apiParam {Boolean} locked-department Indicates if the default department is locked or not
 * @apiUse INVALID_LANGUAGE
 * @apiUse INIT_SETTINGS_DONE
 *
 * @apiSuccess {Object} data Empty object
 *
 */


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
            RedBean::exec(file_get_contents('data/db_schema.sql'));
            $this->storeGlobalSettings();
            $this->storeMailTemplates();
            $this->storeLanguages();
            $this->storeMockedDepartments();

            Response::respondSuccess();
        } else {
            throw new RequestException(ERRORS::INIT_SETTINGS_DONE);
        }
    }

    private function storeGlobalSettings() {
        $this->storeSettings([
            'language' => Controller::request('language'),
            'recaptcha-public' => '',
            'recaptcha-private' => '',
            'server-email' => Controller::request('server-email'),
            'imap-host' => Controller::request('imap-host'),
            'imap-user' => Controller::request('imap-user'),
            'imap-pass' => Controller::request('imap-pass'),
            'smtp-host' => Controller::request('smtp-host'),
            'smtp-user' => Controller::request('smtp-user'),
            'smtp-pass' => Controller::request('smtp-pass'),
            'maintenance-mode' => 0,
            'layout' => 'boxed',
            'allow-attachments' => !!Controller::request('allow-attachments'),
            'max-size' => 1,
            'title' => Controller::request('title') ? Controller::request('title') : 'Support Center',
            'url' => Controller::request('url')  ? Controller::request('url') : ('http://' . $_SERVER['HTTP_HOST']),
            'registration' => !!Controller::request('registration'),
            'last-stat-day' => date('YmdHi', strtotime(' -12 day ')),
            'ticket-gap' => Hashing::generateRandomPrime(100000, 999999),
            'ticket-first-number' => Hashing::generateRandomNumber(100000, 999999),
            'session-prefix' => 'opensupports-'.Hashing::generateRandomToken().'_',
            'mail-template-header-image' => 'https://s3.amazonaws.com/opensupports/logo.png',
            'default-department-id' => 1,
            'default-is-locked' => false,
            'imap-token' => '',
            'mandatory-login' => !!Controller::request('mandatory-login')
        ]);
    }

    private function storeMailTemplates() {
        $mailLanguages = MailTexts::getTexts();

        foreach ($mailLanguages as $language => $mailTemplate) {
            foreach ($mailTemplate as $template => $texts) {
                $mailTemplate = new MailTemplate();

                $mailTemplate->setProperties([
                    'template' => $template,
                    'language' => $language,
                    'subject' => $texts[0],
                    'text1' => array_key_exists(1, $texts) ? $texts[1] : '',
                    'text2' => array_key_exists(2, $texts) ? $texts[2] : '',
                    'text3' => array_key_exists(3, $texts) ? $texts[3] : '',
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
        $defaultLanguage = Controller::request('language');

        foreach(Language::LANGUAGES as $languageCode) {
            $language = new Language();
            $language->setProperties([
                'code' => $languageCode,
                'allowed' => 1,
                'supported' => ($languageCode === $defaultLanguage)
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
            $department->private = 0;
            $department->store();
        }
    }
}
