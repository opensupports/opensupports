#!/bin/bash
# DELETE ALL TABLES
TABLES=$(mysql --host 127.0.0.1 --port 4040 -u root development -e "SHOW TABLES IN development;" | awk '{ print $1}' | grep -v '^Tables')

for t in $TABLES
do
 mysql --host 127.0.0.1 --port 4040 -u root development -e "DROP TABLE $t"
done
