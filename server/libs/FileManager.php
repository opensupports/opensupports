<?php

abstract class FileManager {
    private $fileName;
    private $localPath = 'files/';
    
    public function setLocalPath($localPath) {
        $this->localPath = $localPath;
    }

    public function setFileName($fileName) {
        $this->fileName = $fileName;
    }

    public function getLocalPath() {
        return $this->localPath;
    }

    public function getFileName() {
        return $this->fileName;
    }
    
    public function getFullFilePath() {
        return $this->getLocalPath() . $this->getFileName();
    }
}