echo "1/3 Building frontend..."
cd client
npm run build
rm build/index.html
echo "2/3 Creating api folder..."
cd ../server
echo -n > config.php
mkdir files2
mv files/.htaccess files2
rm -rf files/
mv files2 files
cd ..
mkdir api
mv server/index.php api
mv server/Client.php api
mv server/mysql_client_connect.php api
mv server/.htaccess api
mv server/composer.json api
mv server/composer.lock api
mv -R server/controllers api
mv -R server/data api
mv -R server/libs api
mv -R server/models api
mv -R server/vendor api
mv -R server/files api
echo -n > api/config.php
chmod -R 755 .
cp client/src/index.php client/build
echo "3/3 Generating zip..."
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
