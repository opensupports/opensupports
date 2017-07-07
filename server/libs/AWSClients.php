<?php
use Aws\DynamoDb\SessionHandler;
use Aws\DynamoDb\DynamoDbClient;

class AWSClients {
    private static $dynamoDbClient = null;
    
    public static function getDynamoDbClientInstance() {
        if(!AWSClients::$dynamoDbClient) {
            AWSClients::$dynamoDbClient = new DynamoDbClient([
                'version' => 'latest',
                'region'  => 'us-east-1',
                /*'credentials' => [
                    'key'    => getenv('AWS_KEY'),
                    'secret' => getenv('AWS_PRIVATE'),
                ]*/
                'credentials' => [
                    'key'    => 'AKIAJXLALFXV6GTP5BWA',
                    'secret' => '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',
                ]
            ]);
        }
        
        return AWSClients::$dynamoDbClient;
    }
    
    public static function registerSessionHandler(){
        $sessionHandler = SessionHandler::fromClient(AWSClients::getDynamoDbClientInstance(), [
            'table_name' => 'opensupports_sessions'
        ]);

        $sessionHandler->register();
    }
}