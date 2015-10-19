<?php
require 'api/config.php';
error_reporting(E_ALL);
ini_set('display_errors', 1);

$mbd = new PDO('mysql:host=localhost;dbname=os_dev', 'os_dev', 'os_dev');