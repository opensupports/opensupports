<?php
require_once '../mysql_connect.php';

print 'Begin update v4.4.0...' . PHP_EOL;

// Update Settings
print '[1/1] Update email settings..' . PHP_EOL;
$noReplyEmailSetting = Setting::getSetting('no-reply-email');
$smtpHost = Setting::getSetting('smtp-host');
$smtpPort = Setting::getSetting('smtp-port');
$smtpPassword = Setting::getSetting('smtp-pass');

if($smtpPort->getValue()) $smtpHost->value = $smtpHost->getValue() . ':' . $smtpPort->getValue();

$serverEmail = new Setting();
$serverEmail->setProperties([
    'name' => 'server-email',
    'value' => $noReplyEmailSetting->getValue(),
]);
$imapHost = new Setting();
$imapHost->setProperties([
    'name' => 'imap-host',
    'value' => '',
]);
$imapUser = new Setting();
$imapUser->setProperties([
    'name' => 'imap-user',
    'value' => '',
]);
$imapPass = new Setting();
$imapPass->setProperties([
    'name' => 'imap-pass',
    'value' => '',
]);

$noReplyEmailSetting->delete();
$smtpPort->delete();

$smtpHost->store();
$smtpPassword->store();
$serverEmail->store();
$imapHost->store();
$imapUser->store();
$imapPass->store();

print 'Update Completed!' . PHP_EOL;
