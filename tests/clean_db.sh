#!/bin/bash
# DELETE ALL TABLES
TABLES=$(mysql --host ${MYSQL_HOST} --port ${MYSQL_PORT} -u root development -e "SHOW TABLES IN development;" | awk '{ print $1}' | grep -v '^Tables')

for t in $TABLES
do
 mysql --host ${MYSQL_HOST} --port ${MYSQL_PORT} -u root development -e "DROP TABLE $t"
done
