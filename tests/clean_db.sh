#!/bin/bash

# DELETE ALL TABLES
TABLES=$(mysql -u root development -e "SHOW TABLES IN os_dev;" | awk '{ print $1}' | grep -v '^Tables')

for t in $TABLES
do
 mysql -u root development -e "DROP TABLE $t"
done
