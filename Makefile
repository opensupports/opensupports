deploy-staging-files:
	./build.sh
	FOLDER=dev1 DOMAIN=dev1.opensupports.com make deploy-instance-files
	FOLDER=dev2 DOMAIN=dev2.opensupports.com make deploy-instance-files
	BUCKET=opensupports-packages FILE=dist/opensupports_dev.zip make s3upload

deploy-instance-files:
	cd client && \
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; mirror -R build /${FOLDER}" && \
	cd ../api && \
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; put -O /${FOLDER}/api/ index.php" && \
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; put -O /${FOLDER}/api/ .htaccess" && \
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; put -O /${FOLDER}/api/ composer.json" && \
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; put -O /${FOLDER}/api/ composer.lock" && \
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; mirror -R controllers/ /${FOLDER}/api/controllers/" && \
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; mirror -R data/ /${FOLDER}/api/data/" && \
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; mirror -R libs/ /${FOLDER}/api/libs/" && \
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; mirror -R models/ /${FOLDER}/api/models/" && \
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; mirror -R files/ /${FOLDER}/api/files" && \
	lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; mirror -R vendor/ /${FOLDER}/api/vendor" || true && \
	(curl -i -H "Accept: application/json" -H "Content-Type: application/json" http://${DOMAIN}/api/clear.php || true) && \
	cd .. ;

s3upload:
	aws s3 cp ${FILE} s3://$(BUCKET)/ --cache-control max-age=0
