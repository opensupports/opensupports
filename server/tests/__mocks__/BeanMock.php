<?php
include_once 'tests/__lib__/Mock.php';

class BeanMock extends \Mock implements ArrayAccess {
    private $properties;

    public function __construct($array = []) {
        $this->properties = $array;
    }

    public function offsetSet($offset, $value) {
        $this->__set($offset, $value);
    }

    public function offsetExists($offset) {
        return $this->__isset($offset);
    }

    public function offsetUnset($offset) {
        $this->__unset($offset);
    }

    public function &offsetGet($offset) {
        return $this->__get($offset);
    }

    public function &__get($property) {
        return $this->properties[$property];
    }

    public function __set($property, $value) {
        $this->properties[$property] = $value;
    }

    public function __isset($property) {
        return isset($this->properties[$property]);
    }

    public function __unset($property) {
        unset($this->properties[$property]);
    }
}