red=`tput setaf 1`
yellow=`tput setaf 3`
reset=`tput sgr0`

build:
	@docker pull mysql:5.6
	@docker pull phpmyadmin/phpmyadmin
	@docker pull munkyboy/fakesmtp
	@docker build -t opensupports-srv . || echo "A${red}An error occurred${reset}"

install:
	@docker exec -it opensupports-srv bash -c "cd /var/www/html && composer install" || echo "${red}Please execute 'make run' first${reset}" && chmod 777 -R vendor/
	@docker exec -it opensupports-db bash -c "mysql -u root -e \"CREATE DATABASE IF NOT EXISTS development;\" " || echo "${red}Please execute 'make run' first${reset}"

run:
	@docker run -d --name opensupports-db -p 4040:3306 -e MYSQL_ALLOW_EMPTY_PASSWORD=yes -v $(PWD)/.dbdata/:/var/lib/mysql mysql:5.6
	@docker run -d --name opensupports-myadmin --link opensupports-db:db -p 6060:80 phpmyadmin/phpmyadmin
	@docker run -d --name opensupports-fakesmtp -p 7070:25 -v ${PWD}/.fakemail/:/var/mail munkyboy/fakesmtp
	@docker run -d --name opensupports-srv --net=host --rm -e LOG_STDOUT=true -e LOG_STDERR=true -e LOG_LEVEL=debug -v ${PWD}:/var/www/html opensupports-srv

test:
	@./run-tests.sh

log:
	@docker attach opensupports-srv || echo "${red}Please execute 'make run' first${reset}"

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
