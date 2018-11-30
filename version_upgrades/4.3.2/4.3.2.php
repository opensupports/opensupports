<?php
require_once '../mysql_connect.php';

print 'Begin update v4.3.2...' . PHP_EOL;

// Remove old templates
print '[1/4] Removing old mail templates..' . PHP_EOL;
if(!$mysql->query("DROP TABLE IF EXISTS mailtemplate")) {
    print PHP_EOL . 'Error trying to delete old templates: ' . $mysql->error . PHP_EOL;
}

// Install new templates
print '[2/4] Installing new templates...' . PHP_EOL;
$mailLanguages = MailTexts::getTexts();

foreach ($mailLanguages as $language => $mailTemplate) {
    foreach ($mailTemplate as $template => $texts) {
        $mailTemplate = new MailTemplate();

        $mailTemplate->setProperties([
            'template' => $template,
            'language' => $language,
            'subject' => $texts[0],
            'text1' => array_key_exists(1, $texts) ? $texts[1] : '',
            'text2' => array_key_exists(2, $texts) ? $texts[2] : '',
            'text3' => array_key_exists(3, $texts) ? $texts[3] : '',
        ]);

        $mailTemplate->store();
    }
}
$mysql->query("DELETE FROM setting WHERE name='mail-template-header-image'");
$mysql->query("INSERT INTO setting (id,name,value) VALUES ('', 'mail-template-header-image', 'https://s3.amazonaws.com/opensupports/logo.png')");

// Removing file LCG variables
print '[3/4] Removing file LCG variables...' . PHP_EOL;
$mysql->query("DELETE FROM setting WHERE name='file-gap'") or die('Error trying to delete file-gap: ' . $mysql->error . PHP_EOL);
$mysql->query("DELETE FROM setting WHERE name='file-first-number'") or die('Error trying to delete file-first-number: ' . $mysql->error . PHP_EOL);


// Clear session cookies
print '[4/4] Clearing session cookies...' . PHP_EOL;
if(!$mysql->query("DROP TABLE IF EXISTS sessioncookie")) {
    print PHP_EOL . 'Error trying to delete sessioncookie: ' . $mysql->error . PHP_EOL;
}

print 'Update Completed!' . PHP_EOL;
