<?php
require_once 'models/DataStore.php';

class DataStoreList {
    private $list = [];
    
    public static function getList($type, $beanList) {
        $dataStoreList = new DataStoreList();
        
        foreach ($beanList as $bean) {
            $dataStoreList->add(new $type($bean));
        }
        
        return $dataStoreList;
    }

    public function add(DataStore $dataStore) {
        $this->list[] = $dataStore;
    }

    public function remove(DataStore $dataStore) {
        $dataStoreIndexInList = $this->getIndexInListOf($dataStore);

        unset($this->list[$dataStoreIndexInList]);
    }

    public function toBeanList() {
        $beanList = [];
        
        foreach($this->list as $item) {
            $beanList[] = $item->getBeanInstance();
        }
        
        return $beanList;
    }

    private function getIndexInListOf($dataStore) {
        foreach ($this->list as $itemIdInList => $item) {
            if ($item->id === $dataStore->id) {
                return $itemIdInList;
            }
        }

        return -1;
    }
}