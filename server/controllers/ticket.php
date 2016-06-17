<?php
include 'ticket/create.php';

$ticketControllers = new ControllerGroup();
$ticketControllers->setGroupPath('/ticket');

$ticketControllers->addController(new CreateController);

$ticketControllers->finalize();