<?php
require_once 'system/init-settings.php';
require_once 'system/get-settings.php';
require_once 'system/edit-settings.php';
require_once 'system/add-department.php';
require_once 'system/edit-department.php';
require_once 'system/delete-department.php';
require_once 'system/get-logs.php';
require_once 'system/get-mail-templates.php';
require_once 'system/edit-mail-template.php';
require_once 'system/recover-mail-template.php';
require_once 'system/backup-database.php';
require_once 'system/download.php';

$systemControllerGroup = new ControllerGroup();
$systemControllerGroup->setGroupPath('/system');

$systemControllerGroup->addController(new InitSettingsController);
$systemControllerGroup->addController(new GetSettingsController);
$systemControllerGroup->addController(new EditSettingsController);
$systemControllerGroup->addController(new AddDepartmentController);
$systemControllerGroup->addController(new EditDepartmentController);
$systemControllerGroup->addController(new DeleteDepartmentController);
$systemControllerGroup->addController(new GetLogsController);
$systemControllerGroup->addController(new GetMailTemplatesController);
$systemControllerGroup->addController(new EditMailTemplateController);
$systemControllerGroup->addController(new RecoverMailTemplateController);
$systemControllerGroup->addController(new BackupDatabaseController);
$systemControllerGroup->addController(new DownloadController);

$systemControllerGroup->finalize();