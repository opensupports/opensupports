<?php
require_once 'staff/get.php';

$systemControllerGroup = new ControllerGroup();
$systemControllerGroup->setGroupPath('/staff');

$systemControllerGroup->addController(new GetStaffController);

$systemControllerGroup->finalize();