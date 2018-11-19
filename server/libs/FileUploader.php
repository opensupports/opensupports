<?php

class FileUploader extends FileManager {
    use SingletonTrait;

    private $maxSize = 1;
    private $fileName;
    private $permission;
    private $storage;

    private function __construct() {
        $this->storage = new \Upload\Storage\FileSystem($this->getLocalPath());
    }

    public function isSizeValid($file) {
        return $file['size'] <= (1048576 * $this->maxSize);
    }

    public function upload($fileKey) {
        $file = new \Upload\File($fileKey, $this->storage);
        $file->setName($this->generateFileName($_FILES[$fileKey]['name']));

        $file->addValidations(array(
            new \Upload\Validation\Mimetype([
                'image/png',
                'image/jpeg',
                'image/bmp',
                'image/tiff',

                'application/gzip',
                'application/x-gzip',
                'application/zip',
                'application/x-rar-compressed',
                'application/x-7z-compressed',
                'application/x-tar',
                'application/x-bzip',
                'application/x-bzip2',

                'text/csv',
                'text/rtf',
                'application/msword',
                'application/vnd.ms-excel',
                'text/plain',
                'application/pdf'
            ]),
            new \Upload\Validation\Size($this->maxSize.'M')
        ));

        try {
            $file->upload();
            $this->setFileName($file->getNameWithExtension());
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function generateFileName($fileName) {
        $newName = $this->removeFileExtension($fileName);
        $newName = strtolower($newName);
        $newName = preg_replace('/[^a-zA-Z0-9\d\.\-]/', '_', $newName);
        $result = "";

        if($this->permission) $result = $this->permission . '_';
        else $result = '';

        $result .= substr(Hashing::generateRandomToken(),  0, 6) . '_' . $newName;

        return $result;
    }

    public function removeFileExtension($fileName) {
        return substr($fileName, 0, strrpos($fileName, "."));
    }

    public function setPermission($type = '', $extra = '') {
        if($type === FileManager::PERMISSION_ARTICLE)     $this->permission = 'a';
        else if($type === FileManager::PERMISSION_TICKET) $this->permission = 't' . $extra;
        else if($type === FileManager::PERMISSION_PROFILE)    $this->permission = 'p';
        else $this->permission = '';
    }

    public function setMaxSize($maxSize) {
        $this->maxSize = $maxSize;
    }

    public function setFileName($fileName) {
        $this->fileName = $fileName;
    }

    public function getFileName() {
        return $this->fileName;
    }
}
