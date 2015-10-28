#!/bin/bash

# DELETE ALL TABLES
TABLES=$(mysql -u os_dev -pos_dev os_dev -e "SHOW TABLES IN os_dev;" | awk '{ print $1}' | grep -v '^Tables')

for t in $TABLES
do
 mysql -u os_dev -pos_dev os_dev -e "DROP TABLE $t"
done
