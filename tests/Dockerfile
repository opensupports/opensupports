FROM ubuntu:18.04

RUN mkdir /app
WORKDIR /app

RUN apt update
RUN apt install build-essential openssl curl git-core zlib1g zlib1g-dev libssl-dev libyaml-dev libsqlite3-0 libsqlite3-dev sqlite3 libxml2-dev libxslt-dev autoconf libc6-dev ncurses-dev automake libtool bison --yes
RUN apt install mysql-client --yes
RUN apt install ruby-full --yes
RUN apt install libmysqlclient-dev ruby-dev --yes
RUN gem install bundler

COPY Gemfile /app
RUN bundle install