<?php

class FileUploader extends FileManager {
    private $maxSize = 1;
    private $linearCongruentialGenerator;
    private $linearCongruentialGeneratorOffset;
    private $fileName;
    private $permission;

    private static $instance = null;

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new FileUploader();
        }

        return self::$instance;
    }

    private function __construct() {}

    public function isSizeValid($file) {
        return $file['size'] <= (1048576 * $this->maxSize);
    }

    public function upload($file) {
        $this->setNewName($file['name']);

        if(!$this->isSizeValid($file)) {
            return false;
        }

        move_uploaded_file($file['tmp_name'], $this->getLocalPath() . $this->getFileName());

        return true;
    }

    private function setNewName($fileName) {
        $newName = $fileName;
        $newName = strtolower($newName);
        $newName = preg_replace('/[^a-zA-Z0-9\d\.\-]/', '_', $newName);

        if ($this->linearCongruentialGenerator instanceof LinearCongruentialGenerator) {
            if($this->permission) $this->fileName = $this->permission . '_';
            else $this->fileName = '';

            $this->fileName .= $this->linearCongruentialGenerator->generate($this->linearCongruentialGeneratorOffset) . '_' . $newName;
        }
    }

    public function setPermission($type = '', $extra = '') {
        if($type === FileManager::PERMISSION_ARTICLE)     $this->permission = 'a';
        else if($type === FileManager::PERMISSION_TICKET) $this->permission = 't' . $extra;
        else if($type === FileManager::PERMISSION_PROFILE)    $this->permission = 'p';
        else $this->permission = '';
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
