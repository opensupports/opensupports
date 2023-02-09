DB_HOST ?= `docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' opensupports-db`

build:
	@docker build -t opensupports-tests .

run:
	@docker run -it --network os-net -v ${PWD}:/app -v ${PWD}/../server:/server opensupports-tests make test

run-not-interactive:
	@docker run --network os-net -v ${PWD}:/app -v ${PWD}/../server:/server opensupports-tests make test

clear:
	@docker run -it --network os-net -v ${PWD}:/app -v ${PWD}/../server:/server opensupports-tests make truncate-db

test: export MYSQL_HOST=opensupports-db
test: export MYSQL_PORT=3306
test: export API_URL=http://opensupports-srv
test:
	 ./run-tests.sh


truncate-db: export MYSQL_HOST=opensupports-db
truncate-db: export MYSQL_PORT=3306
truncate-db:
	./truncate_db.sh && \
  ./truncate_db.sh && \
  ./truncate_db.sh
