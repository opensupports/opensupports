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
            'USER_PASSWORD' => [
                'en' => [
                    'subject' => 'Password edited - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-password-en.html')
                ],
                'es' => [
                    'subject' => 'Contraseña a cambiado - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-password-es.html')
                ]
            ],
            'USER_EMAIL' => [
                'en' => [
                    'subject' => 'Email edited - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-email-en.html')
                ],
                'es' => [
                    'subject' => 'Email a cambiado - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-email-es.html')
                ]
            ],
            'PASSWORD_FORGOT' => [
                'en' => [
                    'subject' => 'Recover password - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-password-forgot-en.html')
                ],
                'es' => [
                    'subject' => 'Recuperar password - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-password-forgot-es.html')
                ]
            ],
            'USER_SYSTEM_DISABLED' => [
                'en' => [
                    'subject' => 'Access system changed - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-disabled-en.html')
                ],
                'es' => [
                    'subject' => 'Sistema de acceso cambiado - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-disabled-es.html')
                ]
            ],
            'USER_SYSTEM_ENABLED' => [
                'en' => [
                    'subject' => 'Account created - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-enabled-en.html')
                ],
                'es' => [
                    'subject' => 'Cuenta creada - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-enabled-es.html')
                ]
            ]
        ];
    }
}