<?php
require_once 'system/init-settings.php';
require_once 'system/get-settings.php';
require_once 'system/edit-settings.php';
require_once 'system/add-department.php';
require_once 'system/edit-department.php';
require_once 'system/delete-department.php';

$systemControllerGroup = new ControllerGroup();
$systemControllerGroup->setGroupPath('/system');

$systemControllerGroup->addController(new InitSettingsController);
$systemControllerGroup->addController(new GetSettingsController);
$systemControllerGroup->addController(new EditSettingsController);
$systemControllerGroup->addController(new AddDepartmentController);
$systemControllerGroup->addController(new EditDepartmentController);
$systemControllerGroup->addController(new DeleteDepartmentController);


$systemControllerGroup->finalize();