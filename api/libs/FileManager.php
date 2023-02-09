<?php

abstract class FileManager {
    private $fileName;
    private $localPath = 'files/';

    const PERMISSION_ARTICLE = 'PERMISSION_ARTICLE';
    const PERMISSION_TICKET = 'PERMISSION_TICKET';
    const PERMISSION_PROFILE = 'PERMISSION_PROFILE';

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
