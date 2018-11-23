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

        <script src="https://browser.sentry-cdn.com/4.3.4/bundle.min.js" crossorigin="anonymous"></script>
        <script>Sentry.init({ dsn: 'https://f379a7f252da4b6fb5df2c912239d173@sentry.io/1329605' });</script>
    </head>
    <body>
        <div id="app"></div>

        <?php if (preg_match('~MSIE|Internet Explorer~i', $_SERVER['HTTP_USER_AGENT']) || (strpos($_SERVER['HTTP_USER_AGENT'], 'Trident/7.0; rv:11.0') !== false)): ?>
          <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=String.prototype.startsWith,Array.from,Array.prototype.fill,Array.prototype.keys,Array.prototype.find,Array.prototype.findIndex,Array.prototype.includes,String.prototype.repeat,Number.isInteger,Promise&flags=gated"></script>
        <?php endif; ?>

        <script>
            opensupports_version = '4.3.0';
            root = "<?=$url ?>";
            //Update when https is enabled with a load balancer
            apiRoot = 'http://api.opensupports.com/<?= $client->getClientVersion(); ?>';
            globalIndexPath = "";
            clientId = "<?= $client->getClientId(); ?>"
        </script>
        <script src="https://s3.amazonaws.com/opensupports/opensupports_<?=$client->getClientVersion(); ?>.js"></script>
    </body>
</html>
