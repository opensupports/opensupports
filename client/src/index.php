<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">
    
        <title>OpenSupports</title>
    
        <link rel="stylesheet" href="/css/main.css">
        <link rel="icon" type="image/x-icon" href="/images/icon.png">
    </head>
    <body>
        <div id="app"></div>
        
        <script>
            root = "<?php echo ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']); ?>";
            apiRoot = "<?php echo ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']); ?>" + 'api';
        </script>
        <script src="/js/main.js"></script>
    </body>
</html>