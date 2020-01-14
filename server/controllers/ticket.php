<?php
$ticketControllers = new ControllerGroup();
$ticketControllers->setGroupPath('/ticket');

$ticketControllers->addController(new CreateController);
$ticketControllers->addController(new EditCommentController);
$ticketControllers->addController(new EditTitleController);
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
$ticketControllers->addController(new CreateTagController);
$ticketControllers->addController(new EditTagController);
$ticketControllers->addController(new DeleteTagController);
$ticketControllers->addController(new GetTagsController);
$ticketControllers->addController(new AddTagController);
$ticketControllers->addController(new RemoveTagController);
$ticketControllers->addController(new SearchController);

$ticketControllers->finalize();
