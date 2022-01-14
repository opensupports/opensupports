<?php
    $path = rtrim(str_replace('\\','/',dirname($_SERVER['PHP_SELF'])), '/');
    $url = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $path;
    header('X-Frame-Options: DENY');
?>
<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <title>OpenSupports</title>

        <link rel="icon" type="image/x-icon" href="<?=$url ?>/images/icon.png">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/v4-shims.css">
    </head>
    <body>
        <div id="app"></div>

        <script>
            opensupports_version = '4.11.0';
            root = "<?=$url ?>";
            apiRoot = '<?=$url ?>/api';
            globalIndexPath = "<?=$path ?>";
            showLogs = false;
        </script>
        <?php if (preg_match('~MSIE|Internet Explorer~i', $_SERVER['HTTP_USER_AGENT']) || (strpos($_SERVER['HTTP_USER_AGENT'], 'Trident/7.0; rv:11.0') !== false)): ?>
          <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=String.prototype.startsWith,Array.from,Array.prototype.fill,Array.prototype.keys,Array.prototype.find,Array.prototype.findIndex,Array.prototype.includes,String.prototype.repeat,Number.isInteger,Promise&flags=gated"></script>
        <?php endif; ?>
        <script src="<?=$url ?>/bundle.js"></script>
    </body>
</html>
