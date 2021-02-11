FROM ubuntu:latest

RUN apt-get update

ENV DEBIAN_FRONTEND=noninteractive
ENV APACHE_RUN_DIR=/var/www/html/opensupports
ENV APACHE_PID_FILE=var/run/apache2.pid
ENV APACHE_RUN_USER=www-data
ENV APACHE_RUN_GROUP=www-data
ENV APACHE_LOG_DIR=/var/log/apache2/

RUN ln -fs /usr/share/zoneinfo/America/Recife /etc/localtime
RUN apt-get install -y tzdata
RUN dpkg-reconfigure --frontend noninteractive tzdata
RUN apt-get install -y apache2
RUN apt install -y \
php7.4 \
libapache2-mod-php7.4 \
php7.4-common \
php7.4-mysql \
php7.4-gmp \
php7.4-curl \
php7.4-intl \
php7.4-mbstring \
php7.4-xmlrpc \
php7.4-apcu \
php7.4-gd \
php7.4-bcmath \
php7.4-soap \
php7.4-ldap \
php7.4-imap \
php7.4-xml \
php7.4-cli \
php7.4-zip

RUN apt install -y mariadb-client
RUN apt install -y git unzip curl vim
RUN mkdir /var/www/html/opensupports
WORKDIR /var/www/html/opensupports
RUN curl -LO https://github.com/opensupports/opensupports/releases/download/v4.8.0/opensupports_v4.8.0.zip
RUN unzip opensupports_v4.8.0.zip
COPY ./opensupports.conf /etc/apache2/sites-available/
#COPY ./config.php server/
COPY ./config.php api/
RUN chown -R www-data.www-data /var/www/html/opensupports
RUN a2dissite 000-default
RUN a2ensite opensupports.conf
RUN a2enmod rewrite

EXPOSE 80/tcp
CMD ["apachectl","-D", "FOREGROUND"] 