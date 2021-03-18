# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.145.1/containers/php/.devcontainer/base.Dockerfile

# [Choice] PHP version: 7, 7.4, 7.3
ARG VARIANT="7"
FROM mcr.microsoft.com/vscode/devcontainers/php:0-${VARIANT}

# [Option] Install Node.js
ARG INSTALL_NODE="true"
ARG NODE_VERSION="lts/*"
RUN if [ "${INSTALL_NODE}" = "true" ]; then su vscode -c "source /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} 2>&1"; fi

RUN apt-get update && apt-get install -y libc-client-dev libkrb5-dev && rm -r /var/lib/apt/lists/*
RUN docker-php-ext-configure imap --with-kerberos --with-imap-ssl \
    && docker-php-ext-install imap

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && \
    apt-get install -y mariadb-client && \
    docker-php-ext-install pdo pdo_mysql mysqli

# [Optional] Uncomment this line to install global node packages.
# RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && npm install -g <your-package-here>" 2>&1

RUN composer global require laravel/installer

ENV PATH="/home/vscode/.composer/vendor/bin:${PATH}"

# RUN cd opensupports/server composer install
# RUN composer install
