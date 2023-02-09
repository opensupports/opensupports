<?php
use PHPUnit\Framework\TestCase;

class HashingTest extends TestCase {

    public function testShouldGenerateRandomToken() {
        $token1 = Hashing::generateRandomToken();
        $token2 = Hashing::generateRandomToken();

        $this->assertNotEquals($token1, $token2);
    }

    public function testShouldHashAndVerifyPassword() {
        $TEST_TIMES = 5;

        for ($i = 0; $i < $TEST_TIMES; $i++) {
            $password = Hashing::generateRandomToken();
            $passwordHash = Hashing::hashPassword($password);

            $this->assertTrue(Hashing::verifyPassword($password, $passwordHash));
            $this->assertFalse(Hashing::verifyPassword('', $passwordHash));
            $this->assertFalse(Hashing::verifyPassword($password, ''));
            $this->assertFalse(Hashing::verifyPassword('', ''));
            $this->assertFalse(Hashing::verifyPassword($password . 'a', $passwordHash));
            $this->assertFalse(Hashing::verifyPassword($password, $passwordHash . 'a'));
        }

    }

    public function testShouldGenerateNumber() {
        $TEST_TIMES = 10;

        for ($i = 0; $i < $TEST_TIMES; $i++) {
            $min = $i*1000;
            $max = $TEST_TIMES*6000;

            $number1 = Hashing::generateRandomNumber($min, $max);
            $number2 = Hashing::generateRandomNumber($min, $max);

            $this->assertTrue($min < $number1 && $number1 < $max);
            $this->assertTrue($min < $number2 && $number2 < $max);
            $this->assertNotEquals($number1, $number2);
        }
    }

    public function testShouldRecognizePrime() {
        $primes = [2, 3, 5, 7, 11, 17, 53, 163, 379, 401, 443, 449, 701];
        $nonPrimes = [0, 1, 4, 27, 40, 51, 155, 363, 381, 511, 703, 928];

        foreach($primes as $number) $this->assertTrue(Hashing::isPrime($number));
        foreach($nonPrimes as $number) $this->assertFalse(Hashing::isPrime($number));
    }

    public function testShouldGenerateRandomPrime() {
        $TEST_TIMES = 10;

        for ($i = 0; $i < $TEST_TIMES; $i++) {
            $min = $i*1000;
            $max = $TEST_TIMES*6000;

            $number1 = Hashing::generateRandomPrime($min, $max);
            $number2 = Hashing::generateRandomPrime($min, $max);

            $this->assertTrue($min < $number1 && $number1 < $max);
            $this->assertTrue($min < $number2 && $number2 < $max);
            $this->assertTrue(Hashing::isPrime($number1));
            $this->assertTrue(Hashing::isPrime($number2));
        }
    }
}
