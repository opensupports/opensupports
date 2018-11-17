<?php
$ticketControllers = new ControllerGroup();
$ticketControllers->setGroupPath('/ticket');

$ticketControllers->addController(new CreateController);
$ticketControllers->addController(new CommentController);
$ticketControllers->addController(new TicketGetController);
$ticketControllers->addController(new CheckTicketController);
$ticketControllers->addController(new AddCustomResponseController);
$ticketControllers->addController(new DeleteCustomResponseController);
$ticketControllers->addController(new EditCustomResponseController);
$ticketControllers->addController(new GetCustomResponsesController);
$ticketControllers->addController(new ChangeDepartmentController);
$ticketControllers->addController(new CloseController);
$ticketControllers->addController(new ReOpenController);
$ticketControllers->addController(new ChangePriorityController);
$ticketControllers->addController(new SeenController);
$ticketControllers->addController(new DeleteController);

$ticketControllers->finalize();
