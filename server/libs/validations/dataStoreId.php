<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class DataStoreId extends AbstractRule {
    private $dataStoreName;

    public function __construct($dataStoreName = '') {
        if ($this->isDataStoreNameValid($dataStoreName)) {
            $this->dataStoreName = $dataStoreName;
        } else {
            throw new \Exception("Invalid DataStore: $dataStoreName");
        }
    }

    public function validate($dataStoreId) {
        $dataStore = null;

        switch ($this->dataStoreName) {
            case 'user':
                $dataStore = \User::getUser($dataStoreId);
                break;
            case 'staff':
                $dataStore = \Staff::getUser($dataStoreId);
                break;
            case 'ticket':
                $dataStore = \Ticket::getTicket($dataStoreId);
                break;
            case 'department':
                $dataStore = \Department::getDataStore($dataStoreId);
                break;
            case 'customresponse':
                $dataStore = \CustomResponse::getDataStore($dataStoreId);
                break;
            case 'topic':
                $dataStore = \Topic::getDataStore($dataStoreId);
                break;
            case 'article':
                $dataStore = \Article::getDataStore($dataStoreId);
                break;
            case 'customfield':
                $dataStore = \Customfield::getDataStore($dataStoreId);
                break;
            case 'tag':
                $dataStore =  \Tag::getDataStore($dataStoreId);
                break;
        }

        return !$dataStore->isNull();
    }

    private function isDataStoreNameValid($dataStoreName) {
        return in_array($dataStoreName, [
            'user',
            'staff',
            'ticket',
            'department',
            'customresponse',
            'topic',
            'article',
            'customfield',
            'tag'
        ]);
    }
}
