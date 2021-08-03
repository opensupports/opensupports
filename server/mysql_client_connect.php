<?php
require_once 'Client.php';
include_once 'libs/Controller.php';
$client = new Client(Controller::request('client_id'));

define('MYSQL_HOST', $client->getMySQLSettings()['MYSQL_HOST']);
define('MYSQL_DATABASE', $client->getMySQLSettings()['MYSQL_DATABASE']);
define('MYSQL_USER', $client->getMySQLSettings()['MYSQL_USER']);
define('MYSQL_PASSWORD', $client->getMySQLSettings()['MYSQL_PASSWORD']);
define('MYSQL_PORT', $client->getMySQLSettings()['MYSQL_PORT']);
