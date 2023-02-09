<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /system/edit-settings Edit settings
 * @apiVersion 4.11.0
 *
 * @apiName Edit settings
 *
 * @apiGroup System
 *
 * @apiDescription This path edit the settings of the system.
 *
 * @apiPermission staff3
 *
 * @apiParam {String} allowedLanguages The list of languages allowed.
 * @apiParam {String} supportedLanguages The list of languages supported.
 * @apiParam {Setting} setting A setting can be any of the following: language, recaptcha-public, recaptcha-private, server-email, smtp-host, smtp-port, smtp-user, smtp-pass, maintenance-mode, layout, allow-attachments, max-size, title, url.
 *
 * @apiUse NO_PERMISSION
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class EditSettingsController extends Controller {
    const PATH = '/edit-settings';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'default-department-id' => [
                    'validation' => DataValidator::oneOf(DataValidator::dataStoreId('department'),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_DEFAULT_DEPARTMENT
                ],
            ]
        ];
    }

    public function handler() {
        $settings = [
            'language',
            'recaptcha-public',
            'recaptcha-private',
            'server-email',
            'imap-host',
            'imap-user',
            'imap-pass',
            'imap-token',
            'smtp-host',
            'smtp-user',
            'smtp-pass',
            'maintenance-mode',
            'layout',
            'allow-attachments',
            'max-size',
            'title',
            'url',
            'mail-template-header-image',
            'default-is-locked',
            'default-department-id'
        ];
        $this->checkDefaultDepartmentValid();

        foreach($settings as $setting) {
            if(Controller::request($setting)!==null) {
                $settingInstance = Setting::getSetting($setting);
                $settingInstance->value = Controller::request($setting);
                $settingInstance->store();
            }
        }


        if(Controller::request('allowedLanguages') || Controller::request('supportedLanguages')) {
            $this->handleLanguages();
        }

        Log::createLog('EDIT_SETTINGS', null);

        Response::respondSuccess();
    }

    public function handleLanguages() {
        $allowed = json_decode(Controller::request('allowedLanguages'));
        $supported = json_decode(Controller::request('supportedLanguages'));

        if (array_diff($supported, $allowed)) {
            throw new RequestException(ERRORS::INVALID_SUPPORTED_LANGUAGES);
        }

        foreach(Language::LANGUAGES as $languageCode) {
            $language = Language::getDataStore($languageCode, 'code');

            $language->allowed = in_array($languageCode, $allowed);
            $language->supported = in_array($languageCode, $supported);

            $language->store();
        }
    }

    public function checkDefaultDepartmentValid() {
        $departmentId = Controller::request('default-department-id');

        if($departmentId){
            $Publicdepartments = Department::getPublicDepartmentNames();
            
            $isValid = false;
            
            foreach($Publicdepartments as $department) {
                if($department['id'] == $departmentId){ 
                    $isValid = true;
                }
            }

            if(!$isValid) throw new Exception(ERRORS::INVALID_DEFAULT_DEPARTMENT);
        }
    }
        
}
