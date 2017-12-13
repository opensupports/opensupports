<?php
require_once '../mysql_connect.php';

$mysql->query(file_get_contents('./4.1.0.sql'));
