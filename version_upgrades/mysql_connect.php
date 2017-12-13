<?php

$mysql_host = getenv('MYSQL_HOST');
$mysql_user = getenv('MYSQL_USER');
$mysql_password = getenv('MYSQL_PASSWORD');
$mysql_db = getenv('MYSQL_DB');

$mysql = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_db);

if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}
