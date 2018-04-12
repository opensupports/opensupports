DB_HOST ?= `docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' opensupports-db`

install:
	@apt-get install ruby-full
	@apt-get install libmysqlclient-dev ruby-dev
	@gem install bundler
	@bundle install

run:
	 ./run-tests.sh


clear:
	./clean_db.sh
