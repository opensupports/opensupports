<?php
use Ifsnop\Mysqldump as IMysqldump;
use Respect\Validation\Validator as DataValidator;

class DownloadController extends Controller {
    const PATH = '/download';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'file' => [
                    'validation' => DataValidator::alnum('_.')->noWhitespace()
                ]
            ]
        ];
    }

    public function handler() {
        $fileDownloader = FileDownloader::getInstance();
        $fileDownloader->setFileName(Controller::request('file'));
        $fileDownloader->download();
    }
}