<?php 

class InitialMails {
    public static function retrieve() {
        return [
            'USER_SIGNUP' => [
                'en' => [
                    'subject' => 'Signup {{to}} - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-signup-en.html')
                ],
                'es' => [
                    'subject' => 'Registrado {{to}} - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-signup-es.html')
                ]
            ],
            'USER_EDIT_PASSWORD' => [
                'en' => [
                    'subject' => 'Password edited - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-password-en.html')
                ],
                'es' => [
                    'subject' => 'Contraseña a sido cambiada - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-password-es.html')
                ]
            ],
            'USER_EDIT_EMAIL' => [
                'en' => [
                    'subject' => 'Email edited - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-email-en.html')
                ],
                'es' => [
                    'subject' => 'Tu correo electronico a sido cambiada - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-email-es.html')
                ]
            ]
        ];
    }
}