red=`tput setaf 1`
yellow=`tput setaf 3`
reset=`tput sgr0`

build:
	@docker pull mysql:5.6 || true
	@docker pull phpmyadmin/phpmyadmin || true
	@docker pull munkyboy/fakesmtp || true
	@docker build -t opensupports-srv . || echo "A${red}An error occurred${reset}"
	@docker network create os-net || true

install:
	@docker exec -it opensupports-srv bash -c "cd /var/www/html && composer install" || echo "${red}Please execute 'make run' first${reset}"
	@docker exec -u root -it opensupports-db bash -c "mysql -u root -e \"CREATE DATABASE IF NOT EXISTS development;\" " || echo "${red}Please execute 'make run' first${reset}"

install-not-interactive:
	docker exec opensupports-srv bash -c "cd /var/www/html && composer install" || echo "${red}Please execute 'make run' first${reset}"

setup-vendor-permissions:
	@docker exec opensupports-srv bash -c "cd /var/www/html && chmod 777 -R vendor/ezyang" || echo "${red}Please execute 'make run' first${reset}"
	@docker exec opensupports-srv bash -c "cd /var/www/html && chmod 777 -R files" || echo "${red}Please execute 'make run' first${reset}"

run: stop
	@docker run --platform=linux/amd64 -d --network os-net --name opensupports-db -p 4040:3306 -e MYSQL_ALLOW_EMPTY_PASSWORD=yes -v $(PWD)/.dbdata/:/var/lib/mysql -v $(PWD)/.start-db:/docker-entrypoint-initdb.d mysql:5.6
	@docker run --platform=linux/amd64 -d --network os-net --name opensupports-myadmin --link opensupports-db:db -p 6060:80 phpmyadmin/phpmyadmin
	@docker run --platform=linux/amd64 -d --network os-net --name opensupports-fakesmtp -p 7070:25 -v ${PWD}/.fakemail/:/var/mail munkyboy/fakesmtp
	@docker run --platform=linux/amd64 -d --network os-net --name opensupports-srv -p 8080:80 --link opensupports-db:mysql --rm -e LOG_STDOUT=true -e LOG_STDERR=true -e LOG_LEVEL=debug -v ${PWD}:/var/www/html opensupports-srv

test:
	@docker exec -it opensupports-srv bash -c "cd /var/www/html && ./run-tests.sh"

test-not-interactive:
	@docker exec opensupports-srv bash -c "cd /var/www/html && ./run-tests.sh"

log:
	@docker attach opensupports-srv || echo "${red}Please execute 'make run' first${reset}"

clear-debug:
	@docker exec -it opensupports-srv bash -c "cd /var/www/html && ./run-clear-debug.sh"

debug:
	@docker exec -it opensupports-srv bash -c "cd /var/www/html && ./run-debug.sh"

stop:
	@docker stop opensupports-db && docker rm opensupports-db || true
	@docker stop opensupports-myadmin && docker rm opensupports-myadmin || true
	@docker stop opensupports-fakesmtp && docker rm opensupports-fakesmtp || true
	@docker stop opensupports-srv || true
	@rm -rf .fakemail || true
	@mkdir .fakemail

db:
	@docker exec -it opensupports-db bash -c "mysql -u root" || echo "${red}Please execute 'make run' first${reset}"

sh:
	@docker exec -it opensupports-srv bash

doc:
	@apidoc -i models/ -i data/ -i libs/ -i controllers/ -o apidoc/
