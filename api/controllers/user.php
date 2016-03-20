<?php
include 'user/login.php';
include 'user/signup.php';

$userControllers = new ControllerGroup();
$userControllers->setGroupPath('/user');

$userControllers->addController(new LoginController);
$userControllers->addController(new SignUpController);

$userControllers->finalize();
