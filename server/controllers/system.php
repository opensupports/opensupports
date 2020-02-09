<?php
$systemControllerGroup = new ControllerGroup();
$systemControllerGroup->setGroupPath('/system');

$systemControllerGroup->addController(new CheckRequirementsController);
$systemControllerGroup->addController(new InitDatabaseController);
$systemControllerGroup->addController(new InitSettingsController);
$systemControllerGroup->addController(new InitAdminController);
$systemControllerGroup->addController(new InstallationDoneController);
$systemControllerGroup->addController(new GetSettingsController);
$systemControllerGroup->addController(new EditSettingsController);
$systemControllerGroup->addController(new AddDepartmentController);
$systemControllerGroup->addController(new EditDepartmentController);
$systemControllerGroup->addController(new DeleteDepartmentController);
$systemControllerGroup->addController(new GetLogsController);
$systemControllerGroup->addController(new GetMailTemplateListController);
$systemControllerGroup->addController(new GetMailTemplateController);
$systemControllerGroup->addController(new EditMailTemplateController);
$systemControllerGroup->addController(new RecoverMailTemplateController);
$systemControllerGroup->addController(new DisableRegistrationController);
$systemControllerGroup->addController(new EnableRegistrationController);
$systemControllerGroup->addController(new GetStatsController);
$systemControllerGroup->addController(new AddAPIKeyController);
$systemControllerGroup->addController(new DeleteAPIKeyController);
$systemControllerGroup->addController(new GetAPIKeysController);
$systemControllerGroup->addController(new DeleteAllUsersController);
$systemControllerGroup->addController(new BackupDatabaseController);
$systemControllerGroup->addController(new DownloadController);
$systemControllerGroup->addController(new CSVImportController);
$systemControllerGroup->addController(new DisableUserSystemController);
$systemControllerGroup->addController(new EnableUserSystemController);
$systemControllerGroup->addController(new TestSMTPController);
$systemControllerGroup->addController(new TestIMAPController);
$systemControllerGroup->addController(new EmailPollingController);
$systemControllerGroup->addController(new AddCustomFieldController);
$systemControllerGroup->addController(new DeleteCustomFieldController);
$systemControllerGroup->addController(new GetCustomFieldsController);

$systemControllerGroup->finalize();
