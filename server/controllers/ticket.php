<?php
include 'ticket/create.php';
include 'ticket/comment.php';

$ticketControllers = new ControllerGroup();
$ticketControllers->setGroupPath('/ticket');

$ticketControllers->addController(new CreateController);
$ticketControllers->addController(new CommentController);

$ticketControllers->finalize();