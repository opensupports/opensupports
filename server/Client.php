<?php
require_once 'vendor/autoload.php';
require_once 'libs/AWSClients.php';

class Client {
    const TABLE = 'opensupports_clients';
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
            'MYSQL_PASSWORD' => $this->getItem($this->clientId . '_mysql-password')
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
    private function getItem($key) {
        $value = AWSClients::getDynamoDbClientInstance()->getItem(array(
            'ConsistentRead' => true,
            'TableName' => Client::TABLE,
            'Key' => [
                'id' => [
                    'S' => $key
                ]
            ]
        ))['Item']['value'];

        if(array_key_exists('S', $value)) {
            return $value['S'];
        } else if(array_key_exists('N', $value)) {
            return $value['N'];
        } else {
            return null;
        }
    }
}