<?php
class NullDataStore extends \Mock {

    public function isNull() {
        return true;
    }
}