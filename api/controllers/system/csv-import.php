<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /system/csv-import CSV import
 * @apiVersion 4.11.0
 *
 * @apiName CSV import
 *
 * @apiGroup System
 *
 * @apiDescription This path receives a csv file with a list of users to signup.
 *
 * @apiPermission staff3
 *
 * @apiParam {String} file A csv file with this content format: email, password, name.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PASSWORD
 * @apiUse INVALID_FILE
 * 
 * @apiSuccess {String[]} data Array of errors found
 *
 */

class CSVImportController extends Controller {
    const PATH = '/csv-import';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [],
            'password' => [
                'validation' => DataValidator::notBlank()->length(LengthConfig::MIN_LENGTH_PASSWORD, LengthConfig::MAX_LENGTH_PASSWORD),
                'error' => ERRORS::INVALID_PASSWORD
            ]
        ];
    }

    public function handler() {
        $password = Controller::request('password');

        if(!Hashing::verifyPassword($password, Controller::getLoggedUser()->password)) {
            throw new RequestException(ERRORS::INVALID_PASSWORD);
        }

        $fileUploader = $this->uploadFile(true);

        if(!$fileUploader instanceof FileUploader) {
            throw new RequestException(ERRORS::INVALID_FILE);
        }

        $fileDownloader = FileDownloader::getInstance();
        $fileDownloader->setFileName($fileUploader->getFileName());
        $file = $fileDownloader->fopen();

        $errors = [];

        while($file && ($user = fgetcsv($file)) != false) {
            Controller::setDataRequester(function ($key) use ($user) {
                switch ($key) {
                    case 'email':
                        return $user[0];
                    case 'password':
                        return $user[1];
                    case 'name':
                        return $user[2];
                }

                return null;
            });

            $signupController = new SignUpController(true);

            try {
                $signupController->validate();
                $signupController->handler();
            } catch (\Exception $exception) {
                $errors[] = $exception->getMessage() . ' in email ' . $user[0];
            }
        }

        fclose($file);
        
        unlink($fileUploader->getFullFilePath());
        Response::respondSuccess($errors);
    }
}
