<?php
use PHPUnit\Framework\TestCase;

class LinearCongruentialGeneratorTest extends TestCase {

    public function testAvoidCollisions() {
        $TEST_TIMES = 10;
        $GENERATE_TIMES = 500000;
        $min = 100000;
        $max = 999999;

        for($i = 0; $i < $TEST_TIMES; $i++) {
            $linearCongruentialGenerator = new LinearCongruentialGenerator();
            $linearCongruentialGenerator->setRange($min, $max);
            $linearCongruentialGenerator->setGap(Hashing::generateRandomPrime($min, $max));
            $linearCongruentialGenerator->setFirst(Hashing::generateRandomNumber($min, $max));

            $used = [];

            for($j = 0; $j < $GENERATE_TIMES; $j++) {
                $generatedNumber = $linearCongruentialGenerator->generate($j);
                $this->assertFalse(array_key_exists($generatedNumber, $used));
                $used[$generatedNumber] = true;
            }
        }
    }
}
