<?php
use RedBeanPHP\Facade as RedBean;

abstract class DataStore {
    protected $_bean;
    protected $properties = [];

    public static function isTableEmpty() {
        try {
            return (RedBean::count(static::TABLE) === 0);
        } catch(\Exception $e) {
            return true;
        }
    }

    public static function getFetchAs() {
        return [];
    }

    public static function getDataStore($value, $property = 'id') {
        $bean = RedBean::findOne(static::TABLE, static::validateProp($property) . ' =:value', array(
            ':value'  => $value
        ));

        return ($bean) ? new static($bean) : new NullDataStore();
    }

    public static function count($addSQL = '', $bindings = array()) {
       return RedBean::count(static::TABLE, $addSQL, $bindings);
    }

    public static function getAll() {
        $beanList = RedBean::findAll(static::TABLE);
        $dataStoreList = new DataStoreList();

        foreach($beanList as $bean) {
            $dataStoreList->add(new static($bean));
        }

        return $dataStoreList;
    }
    public static function find($query = '', $matches = []) {
        $beanList = RedBean::find(static::TABLE, $query, $matches);

        return DataStoreList::getList(ucfirst(static::TABLE), $beanList);
    }

    public static function findOne($query = '', $matches = []) {
        $bean = RedBean::findOne(static::TABLE, $query, $matches);

        return ($bean) ? new static($bean) : new NullDataStore();
    }

    private static function validateProp($propToValidate) {
        $validProp = false;

        foreach (static::getProps() as $prop) {
            if ($propToValidate === $prop) {
                $validProp = true;
            }
        }

        return ($validProp) ? self::from_camel_case($propToValidate) : 'id';
    }

    private static function from_camel_case($input) {
        preg_match_all('!([A-Z][A-Z0-9]*(?=$|[A-Z][a-z0-9])|[A-Za-z][a-z0-9]+)!', $input, $matches);
        $ret = $matches[0];
        foreach ($ret as &$match) {
            $match = $match == strtoupper($match) ? strtolower($match) : lcfirst($match);
        }
        return implode('_', $ret);
    }

    public function __construct($beanInstance = null) {
        if ($beanInstance) {
            $this->setBean($beanInstance);
        } else {
            $this->setBean(RedBean::dispense(static::TABLE));
            $this->setProperties($this->getDefaultProps());
        }
    }

    public function getDefaultProps() {
        return [];
    }

    public function setProperties($properties) {
        foreach (static::getProps() as $PROP) {
            if(array_key_exists($PROP, $properties)) {
                $this->properties[$PROP] = $properties[$PROP];
            }
        }
    }

    public function __set($prop, $value) {
        if (in_array($prop, static::getProps())) {
            $this->properties[$prop] = $value;
        } else {
            throw new Exception("Invalid prop: $prop");
        }
    }

    public function &__get($name) {
        if (!array_key_exists($name, $this->properties) || !$this->properties[$name]) {
            $this->properties[$name] = $this->parseBeanProp($name);
        }

        if ($name !== 'id') {
            $property =& $this->properties[$name];
        } else {
            $property = $this->_bean->id;
        }

        return $property;
    }

    private function setBean($beanInstance) {
        $this->_bean = $beanInstance;
    }

    private function parseBeanProp($prop) {
        $fetchAs = static::getFetchAs();

        if(array_key_exists($prop, $fetchAs)) {
            $parsedProp = $this->_bean->fetchAs($fetchAs[$prop])[$prop];
        } else {
            $parsedProp = $this->_bean[$prop];
        }

        if (strpos($prop, 'List')) {
            $parsedProp = DataStoreList::getList($this->getListType($prop), $parsedProp);
        } else if ($parsedProp instanceof \RedBeanPHP\OODBBean) {
            $beanType = ucfirst($parsedProp->getPropertiesAndType()[1]);

            $parsedProp = new $beanType($parsedProp);

        }

        return $parsedProp;
    }

    public function store() {
        $this->updateBeanProperties();

        return RedBean::store($this->getBeanInstance());
    }

    public function delete() {
        RedBean::trash($this->getBeanInstance());
    }

    public function getBeanInstance() {
        return $this->_bean;
    }

    public function isNull() {
        return false;
    }

    public function updateBeanProperties() {
        foreach ($this->properties as $key => $prop) {
            $this->updateBeanProp($key, $prop);
        }
    }

    public function withCondition($condition, $values) {
       return new static($this->_bean->withCondition($condition, $values));
    }

    public function countShared($shared) {
       return $this->_bean->countShared($shared);
    }

    private function updateBeanProp($key, $value) {
        if ($value instanceof DataStoreList) {
            $this->_bean[$key] = $value->toBeanList();
        } else if ($value instanceof DataStore) {
            $this->_bean[$key] = $value->getBeanInstance();
        } else {
            $this->_bean[$key] = $value;
        }
    }

    private function getListType($listName) {
        $listType = $listName;

        $listType = str_replace('List', '', $listType);
        $listType = str_replace('shared', '', $listType);
        $listType = str_replace('xown', '', $listType);
        $listType = str_replace('own', '', $listType);

        return $listType;
    }
}
