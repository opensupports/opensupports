<?php
include 'user/login.php';
include 'user/signup.php';
include 'user/logout.php';
include 'user/check-session.php';
include 'user/recover-password.php';
include 'user/send-recover-password.php';
include 'user/edit-password.php';
include 'user/edit-email.php';
include 'user/get.php';

$userControllers = new ControllerGroup();
$userControllers->setGroupPath('/user');

$userControllers->addController(new LoginController);
$userControllers->addController(new SignUpController);
$userControllers->addController(new LogoutController);
$userControllers->addController(new CheckSessionController);
$userControllers->addController(new SendRecoverPasswordController);
$userControllers->addController(new RecoverPasswordController);
$userControllers->addController(new EditPassword);
$userControllers->addController(new EditEmail);
$userControllers->addController(new GetUserController);

$userControllers->finalize();
