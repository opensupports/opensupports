# OpenSupports Server Dockerfile
# PHP 7.4 기반 Slim 프레임워크 애플리케이션

FROM --platform=linux/amd64 php:7.4-apache

# 필요한 PHP 확장 및 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    unzip \
    git \
    curl \
    libssl-dev \
    libc-client-dev \
    libkrb5-dev \
    && rm -rf /var/lib/apt/lists/*

# PHP 확장 설치
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_mysql \
        mysqli \
        mbstring \
        zip \
        gd \
        xml \
        bcmath

# IMAP 확장 설치 (이메일 기능을 위해)
RUN docker-php-ext-configure imap --with-kerberos --with-imap-ssl \
    && docker-php-ext-install imap

# Composer 설치
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

# Composer 의존성 설치
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Apache 설정
RUN a2enmod rewrite headers
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

# 파일 권한 설정
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 777 /var/www/html/files

# PHP 설정
COPY php.ini /usr/local/etc/php/

# Health check 추가
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]