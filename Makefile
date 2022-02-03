#!make
-include .env

deploy-staging-files:
	./build.sh
	mv dist/opensupports_dev.zip .
	make upload-bundles

deploy-staging-population:
	curl --request POST \
		--url https://circleci.com/api/v2/project/github/opensupports/staging-population/pipeline \
		--header 'Circle-Token: ${CIRCLE_API_USER_TOKEN}' \
		--header 'content-type: application/json' \
		--data '{"branch":"master","parameters":{"server_to_deploy": "dev1"}}'
	curl --request POST \
		--url https://circleci.com/api/v2/project/github/opensupports/staging-population/pipeline \
		--header 'Circle-Token: ${CIRCLE_API_USER_TOKEN}' \
		--header 'content-type: application/json' \
		--data '{"branch":"master","parameters":{"server_to_deploy": "dev2"}}'
	curl --request POST \
		--url https://circleci.com/api/v2/project/github/opensupports/staging-population/pipeline \
		--header 'Circle-Token: ${CIRCLE_API_USER_TOKEN}' \
		--header 'content-type: application/json' \
		--data '{"branch":"master","parameters":{"server_to_deploy": "dev3"}}'
	curl --request POST \
		--url https://circleci.com/api/v2/project/github/opensupports/staging-population/pipeline \
		--header 'Circle-Token: ${CIRCLE_API_USER_TOKEN}' \
		--header 'content-type: application/json' \
		--data '{"branch":"master","parameters":{"server_to_deploy": "dev4"}}'
build-release-bundles:
	$(eval UPGRADE_ZIP="opensupports_v$(VERSION)_update.zip")
	./build.sh
	mv dist/opensupports_dev.zip .
	cp opensupports_dev.zip ${UPGRADE_ZIP} && \
	mv opensupports_dev.zip opensupports_v${VERSION}.zip && \
	zip -d ${UPGRADE_ZIP} "api/config.php" && \
	(( \
		zip -r ${UPGRADE_ZIP} "version_upgrades/${VERSION}" && \
		zip -r ${UPGRADE_ZIP} "version_upgrades/mysql_connect.php" \
	) || true)

upload-bundles:
	for file in *.zip ; do \
		lftp -c "open -u $(FTP_USER),$(FTP_PASSWORD) $(FTP_HOST); set ssl:verify-certificate no; put -O /files/ $${file}"; \
	done

push-prerelease-tag:
	echo -e "Release v${VERSION}\n====\n" > log.txt && \
	git log $(git describe --tags --abbrev=0 @^)..@ --pretty=format:'%s' >> log.txt
	#	./version_upgrades/release_script/node_modules/.bin/github-release upload \
  # --owner opensupports \
  # --repo opensupports \
	# --draft true\
  # --tag "v$(VERSION)" \
  # --release-name "Release v$(VERSION)" \
  # --body "$(<log.txt)" \
  # opensupports_v${VERSION}.zip opensupports_v${VERSION}_update.zip

populate-staging-release:
	curl --request POST \
		--url https://circleci.com/api/v2/project/github/opensupports/staging-population/pipeline \
		--header 'Circle-Token: ${CIRCLE_API_USER_TOKEN}' \
		--header 'content-type: application/json' \
		--data '{"branch":"master","parameters":{"server_to_deploy": "westeros", "version_to_deploy": "${VERSION}"}}'
	curl --request POST \
		--url https://circleci.com/api/v2/project/github/opensupports/staging-population/pipeline \
		--header 'Circle-Token: ${CIRCLE_API_USER_TOKEN}' \
		--header 'content-type: application/json' \
		--data '{"branch":"master","parameters":{"server_to_deploy": "senate", "version_to_deploy": "${VERSION}_update"}}'

deploy-staging-release: build-release-bundles upload-bundles populate-staging-release
