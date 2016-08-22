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
    public static function getRandomTicketNumber($min,$max) {
        return rand($min,$max);
    }
}