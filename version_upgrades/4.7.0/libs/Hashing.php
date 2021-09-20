<?php
class Hashing {
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }

    public static function generateRandomToken() {
        return md5(uniqid(rand()));
    }

    public static function generateRandomNumber($min, $max) {
        return rand($min, $max);
    }

    public static function generateRandomPrime($min, $max) {
        $number = Hashing::generateRandomNumber($min, $max);

        while(!Hashing::isPrime($number)) {
            $number = Hashing::generateRandomNumber($min, $max);
        }

        return $number;
    }

    public static function isPrime($number) {
        $sqrt = sqrt($number);
        $prime = true;

        if($number <= 1) return false;

        for($i = 2; $i <= $sqrt; $i++) {
            if($number % $i === 0) {
                $prime = false;
                break;
            }
        }

        return $prime;
    }
}
