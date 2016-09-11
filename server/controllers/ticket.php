<?php
include 'ticket/create.php';
include 'ticket/comment.php';
include 'ticket/get.php';

$ticketControllers = new ControllerGroup();
$ticketControllers->setGroupPath('/ticket');

$ticketControllers->addController(new CreateController);
$ticketControllers->addController(new CommentController);
$ticketControllers->addController(new TicketGetController);

$ticketControllers->finalize();