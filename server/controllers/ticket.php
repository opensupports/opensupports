<?php
include 'ticket/create.php';
include 'ticket/comment.php';
include 'ticket/get.php';
include 'ticket/add-custom-response.php';
include 'ticket/delete-custom-response.php';
include 'ticket/edit-custom-response.php';
include 'ticket/get-custom-responses.php';

$ticketControllers = new ControllerGroup();
$ticketControllers->setGroupPath('/ticket');

$ticketControllers->addController(new CreateController);
$ticketControllers->addController(new CommentController);
$ticketControllers->addController(new TicketGetController);
$ticketControllers->addController(new AddCustomResponseController);
$ticketControllers->addController(new DeleteCustomResponseController);
$ticketControllers->addController(new EditCustomResponseController);
$ticketControllers->addController(new GetCustomResponsesController);

$ticketControllers->finalize();