rm opensupports_dev.zip || true
cd client
gulp prod --api
rm build/index.html
cd ../server
composer install
cd ..
mkdir api
touch api/config.php
cp server/Client.php api
cp server/mysql_client_connect.php api
cp server/index.php api
cp server/.htaccess api
cp server/composer.json api
cp server/composer.lock api
cp -a server/controllers api/controllers
cp -a server/data api/data
cp -a server/libs api/libs
cp -a server/models api/models
cp -a server/vendor api/vendor
mkdir api/files
touch api/files/.keep
cd client/build
zip opensupports_dev.zip index.php
zip -u opensupports_dev.zip .htaccess
zip -u opensupports_dev.zip css/main.css
zip -u opensupports_dev.zip js/main.js
zip -ur opensupports_dev.zip fonts
zip -ur opensupports_dev.zip images
mv opensupports_dev.zip ../..
cd ../..
zip -ur opensupports_dev.zip api
rm -rf api

