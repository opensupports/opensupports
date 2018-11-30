<?php

function getAPIUrl($version) {
    $apiUrls = [
         '4.3.0' => 'https://api44.opensupports.com/'
    ];

    if(array_key_exists($version, $apiUrls)) return $apiUrls[$version];
    else return 'https://api44.opensupports.com/';
}
