<?php
require_once 'system/init-settings.php';

$systemControllerGroup = new ControllerGroup();
$systemControllerGroup->setGroupPath('/system');

$systemControllerGroup->addController(new InitSettingsController);

$systemControllerGroup->finalize();