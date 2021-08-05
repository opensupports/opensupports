<?php
require_once 'vendor/autoload.php';
require_once 'libs/AWSClients.php';

class Client {
    const CLIENT_TABLE = 'opensupports_clients';
    const VERSION_TABLE = 'opensupports_versions';
    private $clientId;
    private $clientVersion;
    private $clientMySQLSettings;

    public static function getByHost() {
        $client = new Client();
        $client->setClientId($client->getItem($_SERVER['HTTP_HOST']));

        return $client;
    }

    public function __construct($clientId = null) {
        if($clientId) {
            $this->setClientId($clientId);
        }
    }

    public function setClientId($clientId) {
        $this->clientId = $clientId;
        $this->clientVersion = $this->getItem($this->clientId . '_version');
        $this->clientMySQLSettings = [
            'MYSQL_HOST' => $this->getItem($this->clientId . '_mysql-host'),
            'MYSQL_DATABASE' => $this->getItem($this->clientId . '_mysql-db'),
            'MYSQL_USER' => $this->getItem($this->clientId . '_mysql-user'),
            'MYSQL_PASSWORD' => $this->getItem($this->clientId . '_mysql-password'),
            'MYSQL_PORT' => $this->getItem($this->clientId . '_mysql-port')
        ];
    }


    public function getClientId() {
        return $this->clientId;
    }

    public function getClientVersion() {
        return $this->clientVersion;
    }

    public function getMySQLSettings() {
        return $this->clientMySQLSettings;
    }

    public function getStaffLimit() {
        return $this->getItem($this->getClientId().'_staff-limit')*1;
    }

    public function isUpgradeAutomatic() {
        return $this->getItem($this->getClientId().'_automatic-upgrade')*1;
    }

    public function getHiddenSettings() {
        return [
            'recaptcha-public' => $this->getItem('recaptcha-public'),
            'recaptcha-private' => $this->getItem('recaptcha-private'),
            'smtp-host' => $this->getItem('smtp-host'),
            'smtp-user' => $this->getItem('smtp-user'),
            'smtp-pass' => $this->getItem('smtp-pass')
        ];
    }

    public function uploadFile($fileName, $file) {
        $s3Client = AWSClients::getS3ClientInstance();

        $s3Client->putObject([
            'Bucket' => 'ticketcenterfiles',
            'Key'    => $this->getClientId() . '_' . $fileName,
            'Body'   => fopen($file['tmp_name'], 'r'),
            'ACL'    => 'private'
        ]);
    }

    public function downloadFile($fileName, $filePath) {
        $s3Client = AWSClients::getS3ClientInstance();
        $s3Client->getObject([
            'Bucket' => 'ticketcenterfiles',
            'Key'    => $this->getClientId() . '_' . $fileName,
            'SaveAs' => $filePath
        ]);
    }

    public function getClientEmail() {
        return $this->getItem($this->getClientId() . '_email');
    }

    public function getClientVersionURL() {
        return $this->getVersionItem($this->getClientVersion());
    }

    private function getVersionItem($key) {
        $redis = AWSClients::getRedisClientInstance();
        $redis->select(1);
        $versionData = $redis->lrange($key, 0, 1);
        $redis->select(0);
        return $versionData[1];
    }

    public function getItem($key) {
        return AWSClients::getRedisClientInstance()->get($key);
    }
}
