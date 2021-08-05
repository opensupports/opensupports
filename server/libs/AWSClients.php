<?php
use Aws\S3\S3Client;

Predis\Autoloader::register();

class AWSClients {
    private static $s3Client = null;
    private static $redisClient = null;

    public static function getRedisClientInstance() {
        if(!AWSClients::$redisClient) {
            AWSClients::$redisClient = new Predis\Client(getenv('REDIS_URI'));
        }
        
        return AWSClients::$redisClient;
    }

    public static function getS3ClientInstance() {
        if(!AWSClients::$s3Client) {
            AWSClients::$s3Client = new S3Client([
                'version' => 'latest',
                'region'  => 'us-east-1', // IGNORED, ONLY MANTIANED FOR COMPATIBILITY
                'endpoint' => getenv('SPACES_ENDPOINT'),
                'credentials' => [
                    'key'    => getenv('SPACES_KEY'),
                    'secret' => getenv('SPACES_SECRET'),
                ],
            ]);
        }

        return AWSClients::$s3Client;

    }

    public static function registerSessionHandler() {
        $client = new Predis\Client(getenv('REDIS_URI'), ['prefix' => 'sessions:']);
        $client->select(2);
        $handler = new Predis\Session\Handler($client);
        $handler->register();
    }
}