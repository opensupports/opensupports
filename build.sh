echo "1/3 Building frontend..."
rm -r -f api
rm -r -f dist
cd client
npm install
npm run build
rm build/index.html
echo "2/3 Creating api folder..."
cd ../server
composer install
echo -n > config.php
mkdir files2
mv files/.htaccess files2
rm -rf files/
mv files2 files
cd ..
mkdir api
cp -r -f server/index.php api
cp -r -f server/.htaccess api
cp -r -f server/composer.json api
cp -r -f server/composer.lock api
cp -r -f server/controllers api
cp -r -f server/data api
cp -r -f server/libs api
cp -r -f server/models api
cp -r -f server/vendor api
cp -r -f server/files api
cp -r -f server/config.php api
chmod -R 755 .
cp -r -f client/src/index.php client/build
echo "3/3 Generating dist..."
cd client/build
mkdir ../../dist
cp -r -f index.php ../../dist
cp -r -f .htaccess ../../dist
cp -r -f bundle.js ../../dist
cp -r -f images ../../dist
cd ../..
cp -r -f api dist
