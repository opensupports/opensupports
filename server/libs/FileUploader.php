<?php
use Aws\S3\S3Client;

class FileUploader extends FileManager {
    private $maxSize = 1024;
    private $linearCongruentialGenerator;
    private $linearCongruentialGeneratorOffset;
    private $fileName;

    private static $instance = null;

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new FileUploader();
        }

        return self::$instance;
    }

    private function __construct() {}

    public function upload($file) {
        $this->setNewName($file['name']);

        if($file['size'] > (1024 * $this->maxSize)) {
            return false;
        }
        
        /*move_uploaded_file($file['tmp_name'], $this->getLocalPath() . $this->getFileName());*/

        $s3 = new S3Client([
            'version' => 'latest',
            'region'  => 'us-east-1',
            'credentials' => [
                'key'    => 'AKIAJXLALFXV6GTP5BWA',
                'secret' => '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',
            ]
        ]);

        $s3->putObject([
            'Bucket' => 'os4test',
            'Key'    => $this->getFileName(),
            'Body'   => fopen($file['tmp_name'], 'r'),
            'ACL'    => 'public-read'
        ]);

        return true;
    }

    private function setNewName($fileName) {
        $newName = $fileName;
        $newName = strtolower($newName);
        $newName = preg_replace('/\s+/', '_', $newName);

        if ($this->linearCongruentialGenerator instanceof LinearCongruentialGenerator) {
            $newName = $this->linearCongruentialGenerator->generate($this->linearCongruentialGeneratorOffset) . '_' . $newName;
        }

        $this->fileName = $newName;
    }

    public function setGeneratorValues($gap, $first, $offset) {
        $this->linearCongruentialGenerator = new LinearCongruentialGenerator();
        $this->linearCongruentialGeneratorOffset = $offset;

        $this->linearCongruentialGenerator->setGap($gap);
        $this->linearCongruentialGenerator->setFirst($first);
    }
    
    public function setMaxSize($maxSize) {
        $this->maxSize = $maxSize;
    }
    
    public function getFileName() {
        return $this->fileName;
    }

}