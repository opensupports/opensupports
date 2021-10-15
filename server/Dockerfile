FROM fauria/lamp
MAINTAINER Ivan Diaz <ivan@opensupports.com>

RUN apt-get update && \
    apt-get install zip unzip php7.0-zip php7.0-mbstring -y && \
    apt-get remove --yes php7.0-snmp && \
    (curl -s https://getcomposer.org/installer | php) && \
    mv composer.phar /usr/local/bin/composer

# ENVIRONMENT VARIABLES
ENV MYSQL_HOST opensupports-db
ENV MYSQL_PORT 3306
ENV IS_DOCKER 1
