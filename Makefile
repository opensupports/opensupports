install:
	cd client
	npm install
	cd ../server
	composer install
	cd ..

deploy:
	./build.sh
	FOLDER=dev1 DOMAIN=dev1.opensupports.com make deploy-instance
	FOLDER=dev2 DOMAIN=dev2.opensupports.com make deploy-instance
	BUCKET=opensupports-packages FILE=dist/opensupports_dev.zip make s3upload

deploy-instance:
	cd client
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; mirror -R build /${FOLDER}"
	cd ../api
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; put -O /${FOLDER}/api/ index.php"
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; put -O /${FOLDER}/api/ .htaccess"
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; put -O /${FOLDER}/api/ composer.json"
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; put -O /${FOLDER}/api/ composer.lock"
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; mirror -R controllers/ /${FOLDER}/api/controllers/"
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; mirror -R data/ /${FOLDER}/api/data/"
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; mirror -R libs/ /${FOLDER}/api/libs/"
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; mirror -R models/ /${FOLDER}/api/models/"
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; mirror -R files/ /${FOLDER}/api/files"
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; mirror -R vendor/ /${FOLDER}/api/vendor" || true
	curl -i -H "Accept: application/json" -H "Content-Type: application/json" http://${DOMAIN}/api/clear.php
	# curl --request POST 'http://${DOMAIN}/api/system/init-settings' --data "user-system-enabled=1" --data "registration=1" --data "title=Help Center" --data "smtp-host=$(SMTP_HOST)" --data "smtp-user=$(SMTP_USER)" --data "smtp-pass=$(SMTP_PASSWORD)" --data "language=en" --data "allow-attachments=1" --data "imap-host=$(IMAP_HOST)" --data "imap-user=$(IMAP_USER)" --data "imap-pass=$(IMAP_PASSWORD)" --data "server-email=$(SERVER_EMAIL)"
	# curl --request POST 'http://${DOMAIN}/api/system/init-admin' --data "name=Haskell Curry" --data "email=admin@opensupports.com" --data "password=admin"
	cd ..

s3upload:
  aws --region $(S3_REGION) s3 cp ${FILE} s3://$(BUCKET)/ --cache-control max-age=0