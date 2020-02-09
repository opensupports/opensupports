<?php
$systemControllerGroup = new ControllerGroup();
$systemControllerGroup->setGroupPath('/staff');

$systemControllerGroup->addController(new GetStaffController);
$systemControllerGroup->addController(new AssignStaffController);
$systemControllerGroup->addController(new UnAssignStaffController);
$systemControllerGroup->addController(new GetTicketStaffController);
$systemControllerGroup->addController(new GetNewTicketsStaffController);
$systemControllerGroup->addController(new GetAllTicketsStaffController);
$systemControllerGroup->addController(new SearchTicketStaffController);
$systemControllerGroup->addController(new InviteStaffController);
$systemControllerGroup->addController(new GetAllStaffController);
$systemControllerGroup->addController(new DeleteStaffController);
$systemControllerGroup->addController(new EditStaffController);
$systemControllerGroup->addController(new LastEventsStaffController);

$systemControllerGroup->finalize();