<?php
require_once 'system/init-settings.php';
require_once 'system/get-settings.php';

$systemControllerGroup = new ControllerGroup();
$systemControllerGroup->setGroupPath('/system');

$systemControllerGroup->addController(new InitSettingsController);
$systemControllerGroup->addController(new GetSettingsController);

$systemControllerGroup->finalize();