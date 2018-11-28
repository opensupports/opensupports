<?php

/**
 * Trait SingletonTrait
 * This trait helps implementing singleton classes
 * It must be used on each class in a hierarchy that needs to be a singleton
 */
trait SingletonTrait
{
    protected static $instance;

    private function __construct()
    {
    }

    public static function getInstance()
    {
        if (!isset(static::$instance)) {
            static::$instance = new static();
        }
        return static::$instance;
    }
}