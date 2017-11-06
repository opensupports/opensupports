<?php

class Stub {
    private $function;
    public $timesCalled = 0;
    public $lastArgs = null;

    public function __construct($function = null) {
         $this->function = ($function === null) ? function (){} : $function;
    }

    public function __invoke() {
        $this->timesCalled++;
        $this->lastArgs = func_get_args();

        return call_user_func_array($this->function, func_get_args());
    }

    public function returns($arg) {
        $this->function = function () use ($arg) {
            return $arg;
        };

        return $this;
    }

    public function hasBeenCalled() {
        return !!$this->timesCalled;
    }

    public function reset() {
        $this->timesCalled = 0;
        $this->lastArgs = null;
    }

    public function hasBeenCalledWithArgs() {
        $newArgs = func_get_args();
        $oldArgs = $this->lastArgs;

        $argumentsMatchAssertion = json_encode($newArgs) === json_encode($oldArgs);

        return $this->timesCalled && $argumentsMatchAssertion;
    }
}

class Mock {

    public static function stub() {
        return new Stub();
    }

    public static function setStatics($statics) {
        foreach ($statics as $key => $static) {
            static::$functionList[$key] = $static;
        }
    }

    public static function __callStatic($key, $arguments) {
        if (array_key_exists($key, static::$functionList)) {
            $function =  static::$functionList[$key];

            return call_user_func_array($function, $arguments);
        }
    }

    public static function get($key) {
        return static::$functionList[$key];
    }

    public function __construct($arguments = array()) {
        if (!empty($arguments)) {
            foreach ($arguments as $property => $argument) {
                if ($argument instanceOf Closure) {
                    $this->{$property} = self::stub($argument);
                } else {
                    $this->{$property} = $argument;
                }
            }
        }
    }

    public function __set($key, $value){
        if ($value instanceOf Closure) {
            $this->{$key} = self::stub($value);
        } else {
            $this->{$key} = $value;
        }
    }

    public function __call($method, $arguments) {
        if ($this->{$method} && is_callable($this->$method)) {
            return call_user_func_array($this->{$method}, $arguments);
        } else if (array_key_exists($method, static::$functionList)) {
            return self::__callStatic($method, $arguments);
        } else {
            throw new Exception("Fatal error: Call to undefined method stdObject::{$method}()");
        }
    }
}
