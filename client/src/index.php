<?php
    require_once 'api/4.1/Client.php';
    $client = Client::getByHost();

    $path = rtrim(dirname($_SERVER['PHP_SELF']), '/');
    $url = ((isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $path;

    if(!$client->getClientId()) {
        http_response_code(404);
        echo 'Client does not exist';
        exit;
    }
?>
<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">
    
        <title>OpenSupports</title>

        <link rel="stylesheet" href="https://s3.amazonaws.com/opensupports/opensupports_<?=$client->getClientVersion(); ?>.css">
        <link rel="icon" type="image/x-icon" href="<?=$url ?>/images/icon.png">
    </head>
    <body>
        <div id="app"></div>
        
        <script>
            root = "<?=$url ?>";
            //Update when https is enabled with a load balancer
            apiRoot = 'http://api.opensupports.com/<?= $client->getClientVersion(); ?>';
            globalIndexPath = "";
            clientId = "<?= $client->getClientId(); ?>"
        </script>
        <script src="https://s3.amazonaws.com/opensupports/opensupports_<?=$client->getClientVersion(); ?>.js"></script>
    </body>
</html>
