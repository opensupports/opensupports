<?php
class LinearCongruentialGenerator {
    private $gap;
    private $first;
    private $min = 100000;
    private $max = 999999;

    public function setRange($min, $max) {
        $this->min = $min;
        $this->max = $max;
    }

    public function setGap($gap) {
        if(!Hashing::isPrime($gap)) throw new Exception('LinearCongruentialGenerator: gap must be prime');

        $this->gap = $gap;
    }

    public function setFirst($first) {
        $this->first = $first;
    }

    public function generate($offset) {
        if(!$this->first) throw new Exception('LinearCongruentialGenerator: first is not set');
        if(!$this->gap) throw new Exception('LinearCongruentialGenerator: gap is not set');

        return ($this->first - $this->min + $offset * $this->gap) % ($this->max - $this->min + 1) + $this->min;
    }
}
