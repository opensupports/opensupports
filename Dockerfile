FROM php:7.4-fpm

COPY dist /var/www/html
COPY fix-https-reverse-proxy.diff /var/www/html

RUN docker-php-ext-install pdo_mysql; \
	docker-php-ext-install mysqli; \
	docker-php-ext-configure imap --with-kerberos --with-imap-ssl; \
	docker-php-ext-install imap; \
	chmod 777 /var/www/html/api/config.php /var/www/html/api/files; \
	chmod -R 777 /var/www/html/api/vendor/ezyang/htmlpurifier/library/HTMLPurifier/DefinitionCache/; \
	patch /var/www/html/index.php < /var/www/html/fix-https-reverse-proxy.diff;

COPY entrypoint.sh /entrypoint.sh
EXPOSE 9000

