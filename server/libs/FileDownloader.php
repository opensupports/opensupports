<?php
use Aws\S3\S3Client;

class FileDownloader extends FileManager {

    private static $instance = null;

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new FileDownloader();
        }

        return self::$instance;
    }

    private function __construct() {}

    public function download() {
        $fullFilePath = $this->getFullFilePath();

        if(Controller::isProductionEnv()) {
            global $client;
            $client->downloadFile($this->getFileName(), $fullFilePath);
        }

        if(file_exists($fullFilePath) && is_file($fullFilePath)) {
            header('Cache-control: private');
            header('Content-Type: application/octet-stream');
            header('Content-Length: '.filesize($fullFilePath));
            header('Content-Disposition: filename='. $this->getFileName());

            flush();
            $file = fopen($fullFilePath, 'r');
            print fread($file, filesize($fullFilePath));
            fclose($file);
            unlink($fullFilePath);

            return true;
        } else {
            return false;
        }
    }

    public function eraseFile() {
        unlink($this->getLocalPath() . $this->getFileName());
    }
}