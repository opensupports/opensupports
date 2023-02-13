#!/bin/bash
set -e

if [ ! -d /config ]; then
	mkdir /config
fi

if [ ! -f /config/config.php ]; then
	touch /config/config.php
	chmod 777 /config/config.php
fi

rm /var/www/html/api/config.php
ln -s /config/config.php /var/www/html/api/config.php

exec "$@"