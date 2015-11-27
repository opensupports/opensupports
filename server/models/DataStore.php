<?php
use RedBeanPHP\Facade as RedBean;

abstract class DataStore {
    protected $_bean;

    abstract protected function getDefaultProperties();

    public static function getDataStore($value, $property = 'id') {
        $bean = RedBean::findOne(static::TABLE, ':property=:value', array(
            ':property' => $property,
            ':value'  => $value
        ));

        return ($bean) ? new static($bean) : null;
    }

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

    protected static function deleteDataStore($dataStore) {
        if ($dataStore instanceof DataStore) {
            RedBean::trash($dataStore->getBeanInstance());
            unset($dataStore);
            return true;
        }
        else {
            return false;
        }
    }

    public function getBeanInstance() {
        return $this->_bean;
    }

    public function setProperties($properties) {
        foreach (static::PROPERTIES as $PROP) {
            if(array_key_exists($PROP, $properties)) {
                $this->_bean[$PROP] = $properties[$PROP];
            }
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
