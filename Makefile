#!make
include .env

deploy-staging-files:
	./build.sh
	FOLDER=dev1 DOMAIN=dev1.opensupports.com make deploy-instance-files
	FOLDER=dev2 DOMAIN=dev2.opensupports.com make deploy-instance-files
	make upload-bundles

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

deploy-staging-dev1:
	curl -u ${CIRCLE_API_USER_TOKEN}: \
		-d 'build_parameters[CIRCLE_JOB]=deploy_dev1' \
		https://circleci.com/api/v1.1/project/github/opensupports/staging-population/tree/master
	curl -u ${CIRCLE_API_USER_TOKEN}: \
		-d 'build_parameters[CIRCLE_JOB]=deploy_dev2' \
		https://circleci.com/api/v1.1/project/github/opensupports/staging-population/tree/master
	curl -u ${CIRCLE_API_USER_TOKEN}: \
		-d 'build_parameters[CIRCLE_JOB]=deploy_dev3' \
		https://circleci.com/api/v1.1/project/github/opensupports/staging-population/tree/master

build-release-bundles:
	ifndef VERSION
	$(error VERSION is not set)
	endif
	$(eval UPGRADE_ZIP="opensupports_v$(VERSION)_update.zip")
	./build.sh
	cp opensupports_dev.zip ${UPGRADE_ZIP} && \
	mv opensupports_dev.zip opensupports_v${VERSION}.zip && \
	zip -d ${UPGRADE_ZIP} "api/config.php" && \
	zip -r ${UPGRADE_ZIP} "version_upgrades/${VERSION}" && \
	zip -r ${UPGRADE_ZIP} "version_upgrades/mysql_connect.php"

upload-bundles:
	for file in *.zip ; do \
		lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; put -O /files/ $${file}"; \
	done

push-prerelease-tag:
	ifndef VERSION
	$(error VERSION is not set)
	endif
	echo -e "Release v${VERSION}\n====\n" > log.txt && \
	git log $(git describe --tags --abbrev=0 @^)..@ --pretty=format:'%s' >> log.txt && \
	./version_upgrades/release_script/node_modules/.bin/github-release upload \
  --owner opensupports \
  --repo opensupports \
	--draft true\
  --tag "v$(VERSION)" \
  --release-name "Release v$(VERSION)" \
  --body "$(<log.txt)" \
  opensupports_v${VERSION}.zip opensupports_v${VERSION}_update.zip

populate-staging-release:
	ifndef VERSION
	$(error VERSION is not set)
	endif
	curl -u ${CIRCLE_API_USER_TOKEN}: \
		-d 'build_parameters[CIRCLE_JOB]=deploy_westeros' \
		-d 'build_parameters[VERSION]=${VERSION}' \
		https://circleci.com/api/v1.1/project/github/opensupports/staging-population/tree/master
	curl -u ${CIRCLE_API_USER_TOKEN}: \
		-d 'build_parameters[CIRCLE_JOB]=deploy_senate' \
		-d 'build_parameters[VERSION]=${VERSION}' \
		https://circleci.com/api/v1.1/project/github/opensupports/staging-population/tree/master

deploy-staging-release: build-release-bundles upload-bundles populate-staging-release
