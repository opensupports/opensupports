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
        if($offset) return ($this->first - $this->min + $offset * $this->gap) % ($this->max - $this->min + 1) + $this->min;
        else return $this->generateFirst();
    }
    
    public function generateFirst() {
        return Hashing::generateRandomNumber($this->min, $this->max);
    }
}