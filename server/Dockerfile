FROM fauria/lamp
MAINTAINER Ivan Diaz <ivan@opensupports.com>

RUN apt-get update && \
    apt-get install zip unzip php7.0-zip php7.0-mbstring -y && \
    apt-get remove --yes php7.0-snmp && \
    (curl -s https://getcomposer.org/installer | php) && \
    mv composer.phar /usr/local/bin/composer

RUN echo 'LISTEN 8080' >> /etc/apache2/apache2.conf
RUN sed -i "1s/.*/<VirtualHost *:8080>/" /etc/apache2/sites-enabled/000-default.conf
RUN sed -i "5s/.*/Listen 8080/" /etc/apache2/ports.conf

# ENVIRONMENT VARIABLES
ENV MYSQL_HOST 127.0.0.1
ENV MYSQL_PORT 4040
