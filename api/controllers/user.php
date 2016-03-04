<?php

$controllerGroup = new ControllerGroup();
$controllerGroup->setGroupPath('/user');

include 'user/login.php';
include 'user/signup.php';

$controllerGroup->finalize();