<?php

trait SingletonTrait
{
    private static $instance;

    protected function __construct()
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