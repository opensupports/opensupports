echo "1/3 Building frontend..."
cd client
gulp prod --api
rm build/index.html
echo "2/3 Creating api folder..."
cd ../server
mkdir files2
mv files/.htaccess files2
rm -rf files/
mv files2 files
cd ..
mkdir api
cp server/index.php api
cp server/Client.php api
cp server/mysql_client_connect.php api
cp server/.htaccess api
cp server/composer.json api
cp server/composer.lock api
cp -R server/controllers api
cp -R server/data api
cp -R server/libs api
cp -R server/models api
cp -R server/vendor api
cp -R server/files api
echo -n > api/config.php
chmod -R 755 .
echo "3/3 Generating zip..."
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
rm -rf dist
mkdir dist
mv opensupports_dev.zip dist
rm -rf api
