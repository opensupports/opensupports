cd client
npm run build
rm build/index.html
cd ../server
composer install
echo -n > config.php
mkdir files2
mv files/.htaccess files2
rm -rf files/
mv files2 files
cd ..
mkdir api
cp server/index.php api
cp server/.htaccess api
cp server/composer.json api
cp server/composer.lock api
cp server/controllers api
cp server/data api
cp server/libs api
cp server/models api
cp server/vendor api
cp server/files api
cp server/config.php api
cp client/src/index.php client/build
cd client/build
zip opensupports_dev.zip index.php
zip -u opensupports_dev.zip .htaccess
zip -u opensupports_dev.zip bundle.js
zip -ur opensupports_dev.zip images
mv opensupports_dev.zip ../..
cd ../..
zip -ur opensupports_dev.zip api
mkdir dist
mv opensupports_dev.zip dist
