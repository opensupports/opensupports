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

        $s3 = new S3Client([
            'version' => 'latest',
            'region'  => 'us-east-1',
            'credentials' => [
                'key'    => 'AKIAJXLALFXV6GTP5BWA',
                'secret' => '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',
            ]
        ]);

        $s3->getObject([
            'Bucket' => 'os4test',
            'Key'    => $this->getFileName(),
            'SaveAs' => $fullFilePath
        ]);


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