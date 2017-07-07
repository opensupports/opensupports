<?php
    require_once 'api/Client.php';
    $client = Client::getByHost();

    $path = rtrim(dirname($_SERVER['PHP_SELF']), '/');
    $url = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $path;
?>
<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">
    
        <title>OpenSupports</title>
    
        <link rel="stylesheet" href="<?=$url ?>/css/main.css">
        <link rel="icon" type="image/x-icon" href="<?=$url ?>/images/icon.png">
    </head>
    <body>
        <div id="app"></div>
        
        <script>
            root = "<?=$url ?>";
            apiRoot = 'http://api.opensupports.com<?= $apiVersion; ?>';
            globalIndexPath = "";
            clientId = "<?= $client->getClientId(); ?>"
        </script>
        <script src="<?=$url ?>/js/main.js"></script>
    </body>
</html>
