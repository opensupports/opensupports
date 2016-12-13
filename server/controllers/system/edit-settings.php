<?php
use Respect\Validation\Validator as DataValidator;

class EditSettingsController extends Controller {
    const PATH = '/edit-settings';

    private $setting;

    public function validations() {
        return[
            'permission' => 'staff_3',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::length(4),
                    'error' => ERRORS::INVALID_SETTING
                ],
            ]
        ];
    }

    public function handler() {
        $this->setting = Setting::getSetting(Controller::request('name'));
        $this->editInformation();

        Response::respondSuccess();
    }
    public function editInformation() {

        if(Controller::request('manteniance-mode')) {
            $this->setting->manteniance_mode = Controller::request('manteniance-mode');
        }

        if(Controller::request('system-title')) {
            $this->setting->system_title = Controller::request('system-title');
        }

        if(Controller::request('timezone')) {
            $this->setting->timezone = Controller::request('timezone');
        }

        if(Controller::request('layout')) {
            $this->setting->layout = Controller::request('layout');
        }

        if(Controller::request('smtp-server')) {
            $this->setting->smtp_server = Controller::request('smtp-server');
        }

        if(Controller::request('smtp-email')) {
            $this->setting->smtp_email = Controller::request('smtp-email');
        }

        if(Controller::request('smtp-password')) {
            $this->setting->smtp_password = Controller::request('smtp-password');
        }

        if(Controller::request('smtp-port')) {
            $this->setting->smtp_port = Controller::request('smtp-port');
        }

        if(Controller::request('default-language')) {
            $this->setting->default_language = Controller::request('default-language');
        }
        if(Controller::request('recaptcha-public')) {
            $this->setting->recaptcha_public = Controller::request('recaptcha-public');
        }
        if(Controller::request('recaptcha-private')) {
            $this->setting->sharedDepartmentList = Controller::request('recaptcha-private');
        }
        if(Controller::request('allow-attachments')) {
            $this->setting->allow_attachments = Controller::request('allow-attachments');
        }
        if(Controller::request('max-size')) {
            $this->setting->max_size = Controller::request('max-size');
        }
        $this->setting->store();
    }
}