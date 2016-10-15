<?php
require_once 'staff/get.php';
require_once 'staff/assign-ticket.php';
require_once 'staff/un-assign-ticket.php';
require_once 'staff/get-tickets.php';

$systemControllerGroup = new ControllerGroup();
$systemControllerGroup->setGroupPath('/staff');

$systemControllerGroup->addController(new GetStaffController);
$systemControllerGroup->addController(new AssignStaffController);
$systemControllerGroup->addController(new UnAssignStaffController);
$systemControllerGroup->addController(new GetTicketStaffController);

$systemControllerGroup->finalize();