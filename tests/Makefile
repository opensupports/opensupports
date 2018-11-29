DB_HOST ?= `docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' opensupports-db`

install:
	@apt-get install ruby-full
	@apt-get install libmysqlclient-dev ruby-dev
	@gem install bundler
	@bundle install

run: export MYSQL_HOST=127.0.0.1
run: export MYSQL_PORT=3306
run:
	 ./run-tests.sh


clear: export MYSQL_HOST=127.0.0.1
clear: export MYSQL_PORT=4040
clear:
	./clean_db.sh && \
  ./clean_db.sh && \
  ./clean_db.sh
