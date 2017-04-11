<?php
require_once 'staff/get.php';
require_once 'staff/assign-ticket.php';
require_once 'staff/un-assign-ticket.php';
require_once 'staff/get-tickets.php';
require_once 'staff/get-new-tickets.php';
require_once 'staff/get-all-tickets.php';
require_once 'staff/search-tickets.php';
require_once 'staff/add.php';
require_once 'staff/get-all.php';
require_once 'staff/delete.php';
require_once 'staff/edit.php';
require_once 'staff/last-events.php';

$systemControllerGroup = new ControllerGroup();
$systemControllerGroup->setGroupPath('/staff');

$systemControllerGroup->addController(new GetStaffController);
$systemControllerGroup->addController(new AssignStaffController);
$systemControllerGroup->addController(new UnAssignStaffController);
$systemControllerGroup->addController(new GetTicketStaffController);
$systemControllerGroup->addController(new GetNewTicketsStaffController);
$systemControllerGroup->addController(new GetAllTicketsStaffController);
$systemControllerGroup->addController(new SearchTicketStaffController);
$systemControllerGroup->addController(new AddStaffController);
$systemControllerGroup->addController(new GetAllStaffController);
$systemControllerGroup->addController(new DeleteStaffController);
$systemControllerGroup->addController(new EditStaffController);
$systemControllerGroup->addController(new LastEventsStaffController);

$systemControllerGroup->finalize();