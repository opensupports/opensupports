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
            ],
            'PASSWORD_FORGOT' => [
                'en' => [
                    'subject' => 'forgotten password - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-password-forgot-en.html')
                ],
                'es' => [
                    'subject' => 'Contraseña olvidada - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-password-forgot-es.html')
                ]
            ],
            'PASSWORD_RECOVERED' => [
                'en' => [
                    'subject' => 'Recover Password - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-recovered-password-en.html')
                ],
                'es' => [
                    'subject' => 'Recuperación de contraseña - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-recovered-password-es.html')
                ]
            ],
            'USER_SYSTEM_DISABLED' => [
                'en' => [
                    'subject' => 'Account has been deleted - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-disabled-en.html')
                ],
                'es' => [
                    'subject' => 'cuanta borrada - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-disabled-es.html')
                ]
            ],
            'USER_SYSTEM_ENABLED' => [
                'en' => [
                    'subject' => 'account has been created - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-enabled-en.html')
                ],
                'es' => [
                    'subject' => 'se te ha creado una cuenta  - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-enabled-es.html')
                ]
            ]
        ];
    }
}