<?php

class FileDownloader extends FileManager {
    use SingletonTrait;

    public function download() {
        $fullFilePath = $this->getFullFilePath();

        if(file_exists($fullFilePath) && is_file($fullFilePath)) {
            header('Cache-control: private');
            header('Content-Type: ' . $this->getFileContentType());
            header('Content-Length: ' . filesize($fullFilePath));
            header('Content-Disposition: filename=' . $this->getFileName());

            flush();
            $file = fopen($fullFilePath, 'r');
            print fread($file, filesize($fullFilePath));
            fclose($file);

            return true;
        } else {
            return false;
        }
    }

    public function eraseFile() {
        unlink($this->getLocalPath() . $this->getFileName());
    }

    public function getFileContentType() {
      $fileExtension = substr($this->getFileName(), -3);
      $contentTypes = [
        'jpg' => 'image/jpeg',
        'gif' => 'image/fig',
        'png' => 'image/png',
        'default' => 'application/octet-stream',
      ];

      return $contentTypes[
          array_key_exists($fileExtension, $contentTypes) ? $fileExtension : 'default'
      ];
    }

    public function getFilePermission() {
        if(!strlen($this->getFileName())) return NULL;
        $indicator = $this->getFileName()[0];

        if($indicator === 'a') {
            return FileManager::PERMISSION_ARTICLE;
        } else if($indicator === 't') {
            return FileManager::PERMISSION_TICKET;
        } else if($indicator === 'p') {
            return FileManager::PERMISSION_PROFILE;
        }

        return NULL;
    }

    public function getTicketNumber() {
        $fileName = $this->getFileName();
        if(strlen($fileName) < 2) return NULL;
        $ticketNumber = 0;

        for($i=1; $fileName[$i] !== '_'; $i++) {
            $ticketNumber *= 10;
            $ticketNumber += $fileName[$i];
        }

        return $ticketNumber;
    }
}
