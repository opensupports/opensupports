- Open https://docs.opensupports.com/guides/installation
  (keep it open in a separate tab so you can refer it during installation)

- Login to the hostinger account (you should have a website created already)

- In hostinger (or your hosting server),
  update the php version to one that is supported by open supports (7.4 as of 2023 January)

- Download the zip file from
  http://www.opensupports.com/download/ which has the latest stable version of OpenSupports.
- Unzip the package in a folder of your server, for example: yourwebsite.com/support

- Go to yourwebsite.com/support (or the place where you extracted the file) and it
  should take you to the installation wizard.

Troubleshooting:

- the installation wizard might not appear sometimes, follow this step to make it appear,

  - check if php pdo plugin is enabled in the webserver (from your hosting server, access php settings)
  - There will be an error in the backend with call to get_magic_quotes_gpc(),
    Solution:
    Open the file api/vendor/slim/slim/Slim/Http/Util.php
    and find the line 60
    $strip = is_null($overrideStripSlashes) ? get_magic_quotes_gpc() : $overrideStripSlashes;
      and replace it with
      $strip = $overrideStripSlashes;

    reference:
    https://stackoverflow.com/questions/61054418/php-7-4-deprecated-get-magic-quotes-gpc-function-alternative
    https://github.com/opensupports/opensupports/issues/908

    ***

- Database creation step will fail sometimes, for this, do the following,
  Create the database manually from tools provided by the hosting provider (or via phpmyadmin)
  manually update the config.php with the following content with the new created sql db values

   <?php
       define('MYSQL_HOST', '127.0.0.1');
       define('MYSQL_PORT', '3306');
       define('MYSQL_USER', 'user');
       define('MYSQL_PASSWORD', 'user');
       define('MYSQL_DATABASE', 'dbname');
   ?>

  Now you might be facing the INIT_SETTINGS_DONE error which you can resolve and get to the next step by
  removing the following line from config.php
  define('MYSQL_HOST', '127.0.0.1');
  Now in the installation wizard step for db connection, fill the hostname and other values such as username and
  db name should match what was created in the config
  And then fill the hostname in the My SQL config form in the installation wizard.

  reference: https://github.com/opensupports/opensupports/issues/176
