<?php

/**
 * @api {post} /system/check-requirements Checks requirements
 * @apiVersion 4.6.1
 *
 * @apiName Check requirements
 *
 * @apiGroup System
 *
 * @apiDescription This path checks and retrieves the current requirements for the installation.
 *
 * @apiPermission any
 *
 * @apiSuccess {Object} data
 *
 */

class CheckRequirementsController extends Controller {
    const PATH = '/check-requirements';
    const METHOD = 'POST';

    const requiredPHPVersion = '5.6';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        if(InstallationDoneController::isInstallationDone()) {
          throw new RequestException(ERRORS::INIT_SETTINGS_DONE);
        }

        Response::respondSuccess([
            'phpVersion' => [
                'name' => 'PHP Version',
                'value' => phpversion(),
                'ok' => $this->checkVersion()
            ],
            'PDO' => [
                'name' => 'PDO Module',
                'value' => class_exists('PDO') ? 'Available' : 'Not available',
                'ok' => class_exists('PDO')
            ],
            'configFile' => [
                'name' => 'File: /api/config.php',
                'value' => is_writable('config.php') ? 'Writable' : 'Not writable',
                'ok' => is_writable('config.php')
            ],
            'files' => [
                'name' => 'Folder: /api/files',
                'value' => is_writable('files') ? 'Writable' : 'Not writable',
                'ok' => is_writable('files')
            ]
        ]);
    }

    private function checkVersion() {
        $requiredVersion = explode('.', CheckRequirementsController::requiredPHPVersion);
        $currentVersion = explode('.', phpversion());

        if($currentVersion[0] > $requiredVersion[0]) return true;
        else if($currentVersion[0] < $requiredVersion[0]) return false;
        else return $currentVersion[1] >= $requiredVersion[1];
    }
}
