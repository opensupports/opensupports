<?php
include 'user/login.php';
include 'user/signup.php';
include 'user/logout.php';
include 'user/recoverpassword.php';
include 'user/sendrecoverpassword.php';

$userControllers = new ControllerGroup();
$userControllers->setGroupPath('/user');

$userControllers->addController(new LoginController);
$userControllers->addController(new SignUpController);
$userControllers->addController(new LogoutController);
$userControllers->addController(new SendRecoverPasswordController);
$userControllers->addController(new RecoverPasswordController);

$userControllers->finalize();
