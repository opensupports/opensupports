<?php
include 'article/add-topic.php';
include 'article/edit-topic.php';
include 'article/delete-topic.php';
include 'article/add.php';
include 'article/edit.php';
include 'article/delete.php';
include 'article/get-all.php';

$articleControllers = new ControllerGroup();
$articleControllers->setGroupPath('/article');

$articleControllers->addController(new AddTopicController);
$articleControllers->addController(new EditTopicController);
$articleControllers->addController(new DeleteTopicController);
$articleControllers->addController(new AddArticleController);
$articleControllers->addController(new EditArticleController);
$articleControllers->addController(new DeleteArticleController);
$articleControllers->addController(new GetAllArticlesController);

$articleControllers->finalize();