<?php
include 'ticket/create.php';
include 'ticket/comment.php';
include 'ticket/get.php';
include 'ticket/check.php';
include 'ticket/add-custom-response.php';
include 'ticket/delete-custom-response.php';
include 'ticket/edit-custom-response.php';
include 'ticket/get-custom-responses.php';
include 'ticket/change-department.php';
include 'ticket/close.php';
include 'ticket/re-open.php';
include 'ticket/change-priority.php';
include 'ticket/seen.php';

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

$ticketControllers->finalize();