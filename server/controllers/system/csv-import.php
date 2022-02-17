<?php

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
            'requestData' => []
        ];
    }

    public function handler() {
        $fileUploader = $this->uploadFile(true);

        if(!$fileUploader instanceof FileUploader) {
            throw new RequestException(ERRORS::INVALID_FILE);
        }

        $file = fopen($fileUploader->getFullFilePath(),'r');
        $errors = [];

        $user = fgetcsv($file);

        while($user != null) {
            if($user == false) {
                throw new RequestException("Error trying to read file");
            }

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

            $user = fgetcsv($file);
        }

        fclose($file);
        
        unlink($fileUploader->getFullFilePath());
        
        Response::respondSuccess($errors);
    }
}