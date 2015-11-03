<?php
use RedBeanPHP\Facade as RedBean;

abstract class DataStore {
    protected $_id;
    protected $_bean;

    abstract protected function getDefaultProperties();

    public function __construct($beanInstance = null) {

        if ($beanInstance) {
            $this->_bean = $beanInstance;
        }
        else {
            $this->_bean = RedBean::dispense(static::TABLE);
            $defaultProperties = $this->getDefaultProperties();
            foreach ($defaultProperties as $PROP => $VALUE) {
                $this->_bean[$PROP] = $VALUE;
            }
        }
    }

    protected function deleteDataStore($dataStore) {
        if ($dataStore instanceof DataStore) {
            RedBean::trash($dataStore->getBeanInstance());
            unset($dataStore);
            return true;
        }
        else {
            return false;
        }
    }

    protected function getBeanInstance() {
        return $this->_bean;
    }

    public function setProperties($properties) {
        foreach (static::PROPERTIES as $PROP) {
            $this->_bean[$PROP] = $properties[$PROP];
        }
    }

    public function __get($name) {
        if ($this->_bean[$name]) {
            return $this->_bean[$name];
        }
        else {
            return null;
        }
    }

    public function store() {
        return RedBean::store($this->_bean);
    }
}
