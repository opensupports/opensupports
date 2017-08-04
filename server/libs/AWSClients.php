<?php
use Aws\DynamoDb\SessionHandler;
use Aws\DynamoDb\DynamoDbClient;
use Aws\S3\S3Client;

class AWSClients {
    private static $dynamoDbClient = null;
    private static $s3Client = null;

    public static function getDynamoDbClientInstance() {
        if(!AWSClients::$dynamoDbClient) {
            AWSClients::$dynamoDbClient = new DynamoDbClient([
                'version' => 'latest',
                'region'  => 'us-east-1'
            ]);
        }
        
        return AWSClients::$dynamoDbClient;
    }

    public static function getS3ClientInstance() {
        if(!AWSClients::$s3Client) {
            AWSClients::$s3Client = new S3Client([
                'version' => 'latest',
                'region'  => 'us-east-1'
            ]);
        }

        return AWSClients::$s3Client;

    }

    public static function registerSessionHandler() {
        $sessionHandler = SessionHandler::fromClient(AWSClients::getDynamoDbClientInstance(), [
            'table_name' => 'opensupports_sessions'
        ]);

        $sessionHandler->register();
    }
}