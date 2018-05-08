<?php
require_once 'data/TextsMails.php';

class InitialMails {
    public static function retrieve() {
        return [
            'USER_SIGNUP' => [
                'en' => [
                    'subject' => 'Signup {{to}} - OpenSupports',
                    'body' => self::userSignup('en')
                ],
                'es' => [
                    'subject' => 'Registrado {{to}} - OpenSupports',
                    'body' => self::userSignup('es')
                ],
                'de' => [
                    'subject' => 'Anmelden {{to}} - OpenSupports',
                    'body' => self::userSignup('de')
                ],
                'fr' => [
                    'subject' => 'S\'inscrire {{to}} - OpenSupports',
                    'body' => self::userSignup('fr')
                ],
                'in' => [
                    'subject' => 'Daftar - OpenSupports',
                    'body' => self::userSignup('in')
                ],
                'jp' => [
                    'subject' => 'サインアップ - OpenSupports',
                    'body' => self::userSignup('jp')
                ],
                'pt' => [
                    'subject' => 'Inscrever-se {{to}} - OpenSupports',
                    'body' => self::userSignup('pt')
                ],
                'ru' => [
                    'subject' => 'Зарегистрироваться {{to}} - OpenSupports',
                    'body' => self::userSignup('ru')
                ],
                'tr' => [
                    'subject' => 'kaydol {{to}} - OpenSupports',
                    'body' => self::userSignup('tr')
                ],
                'cn' => [
                    'subject' => '注册 {{to}} - OpenSupports',
                    'body' => self::userSignup('cn')
                ],
                'it' => [
                    'subject' => 'Sei iscritto {{to}} - OpenSupports',
                    'body' => self::userSignup('it')
                ]
            ],
            'USER_PASSWORD' => [
                'en' => [
                    'subject' => 'Password edited - OpenSupports',
                    'body' => self::userEditPassword('en')
                ],
                'es' => [
                    'subject' => 'Contraseña a cambiado - OpenSupports',
                    'body' => self::userEditPassword('es')
                ],
                'de' => [
                    'subject' => 'Passwort bearbeitet - OpenSupports',
                    'body' => self::userEditPassword('de')
                ],
                'fr' => [
                    'subject' => 'Mot de passe modifié - OpenSupports',
                    'body' => self::userEditPassword('fr')
                ],
                'in' => [
                    'subject' => 'sandi diedit - OpenSupports',
                    'body' => self::userEditPassword('in')
                ],
                'jp' => [
                    'subject' => 'パスワードの編集 - OpenSupports',
                    'body' => self::userEditPassword('jp')
                ],
                'pt' => [
                    'subject' => 'Senha editada - OpenSupports',
                    'body' => self::userEditPassword('pt')
                ],
                'ru' => [
                    'subject' => 'Пароль изменен - OpenSupports',
                    'body' => self::userEditPassword('ru')
                ],
                'tr' => [
                    'subject' => 'Şifre düzenlendi - OpenSupports',
                    'body' => self::userEditPassword('tr')
                ],
                'cn' => [
                    'subject' => '密码已编辑 - OpenSupports',
                    'body' => self::userEditPassword('cn')
                ],
                'it' => [
                    'subject' => 'Password modificata - OpenSupports',
                    'body' => self::userEditPassword('it')
                ]
            ],
            'USER_EMAIL' => [
                'en' => [
                    'subject' => 'Email edited - OpenSupports',
                    'body' => self::userEditEmail('en')
                ],
                'es' => [
                    'subject' => 'Email a cambiado - OpenSupports',
                    'body' => self::userEditEmail('es')
                ],
                'de' => [
                    'subject' => 'E-Mail bearbeitet - OpenSupports',
                    'body' => self::userEditEmail('de')
                ],
                'fr' => [
                    'subject' => 'Courrier électronique - OpenSupports',
                    'body' => self::userEditEmail('fr')
                ],
                'in' => [
                    'subject' => 'email diedit - OpenSupports',
                    'body' => self::userEditEmail('in')
                ],
                'jp' => [
                    'subject' => '電子メールを編集しました - OpenSupports',
                    'body' => self::userEditEmail('jp')
                ],
                'pt' => [
                    'subject' => 'Email editado - OpenSupports',
                    'body' => self::userEditEmail('pt')
                ],
                'ru' => [
                    'subject' => 'Сообщение изменено - OpenSupports',
                    'body' => self::userEditEmail('ru')
                ],
                'tr' => [
                    'subject' => 'E-posta düzenlendi - OpenSupports',
                    'body' => self::userEditEmail('tr')
                ],
                'cn' => [
                    'subject' => '电子邮件已修改 - OpenSupports',
                    'body' => self::userEditEmail('cn')
                ],
                'it' => [
                    'subject' => 'E-mail modificata - OpenSupports',
                    'body' => self::userEditEmail('it')
                ]
            ],
            'PASSWORD_FORGOT' => [
                'en' => [
                    'subject' => 'Recover password - OpenSupports',
                    'body' => self::userPasswordForgot('en')
                ],
                'es' => [
                    'subject' => 'Recuperar password - OpenSupports',
                    'body' => self::userPasswordForgot('es')
                ],
                'de' => [
                    'subject' => 'Passwort wiederherstellen - OpenSupports',
                    'body' => self::userPasswordForgot('de')
                ],
                'fr' => [
                    'subject' => 'Récupérer mot de passe - OpenSupports',
                    'body' => self::userPasswordForgot('fr')
                ],
                'in' => [
                    'subject' => 'memulihkan password - OpenSupports',
                    'body' => self::userPasswordForgot('in')
                ],
                'jp' => [
                    'subject' => 'パスワードを回復 - OpenSupports',
                    'body' => self::userPasswordForgot('jp')
                ],
                'pt' => [
                    'subject' => 'Recuperar senha - OpenSupports',
                    'body' => self::userPasswordForgot('pt')
                ],
                'ru' => [
                    'subject' => 'Восстановить пароль - OpenSupports',
                    'body' => self::userPasswordForgot('ru')
                ],
                'tr' => [
                    'subject' => 'Şifre kurtarma - OpenSupports',
                    'body' => self::userPasswordForgot('tr')
                ],
                'cn' => [
                    'subject' => '恢复密码 - OpenSupports',
                    'body' => self::userPasswordForgot('cn')
                ],
                'it' => [
                    'subject' => 'Recupera la password - OpenSupports',
                    'body' => self::userPasswordForgot('it')
                ]
            ],
            'USER_SYSTEM_DISABLED' => [
                'en' => [
                    'subject' => 'Access system changed - OpenSupports',
                    'body' => self::userSystemDisabled('en')
                ],
                'es' => [
                    'subject' => 'Sistema de acceso cambiado - OpenSupports',
                    'body' => self::userSystemDisabled('es')
                ],
                'de' => [
                    'subject' => 'Access system changed - OpenSupports',
                    'body' => self::userSystemDisabled('de')
                ],
                'fr' => [
                    'subject' => 'Système d\'accès modifié - OpenSupports',
                    'body' => self::userSystemDisabled('fr')
                ],
                'in' => [
                    'subject' => 'sistem akses berubah - OpenSupports',
                    'body' => self::userSystemDisabled('in')
                ],
                'jp' => [
                    'subject' => 'アクセスシステムが変更されました - OpenSupports',
                    'body' => self::userSystemDisabled('jp')
                ],
                'pt' => [
                    'subject' => 'Sistema de acesso alterado - OpenSupports',
                    'body' => self::userSystemDisabled('pt')
                ],
                'ru' => [
                    'subject' => 'Система доступа изменена - OpenSupports',
                    'body' => self::userSystemDisabled('ru')
                ],
                'tr' => [
                    'subject' => 'Erişim sistemi değiştirildi - OpenSupports',
                    'body' => self::userSystemDisabled('tr')
                ],
                'cn' => [
                    'subject' => '访问系统更改 - OpenSupports',
                    'body' => self::userSystemDisabled('cn')
                ],
                'it' => [
                    'subject' => 'Il sistema di accesso è cambiato - OpenSupports',
                    'body' => self::userSystemDisabled('it')
                ]
            ],
            'USER_SYSTEM_ENABLED' => [
                'en' => [
                    'subject' => 'Account created - OpenSupports',
                    'body' => self::userSystemEnabled('en')
                ],
                'es' => [
                    'subject' => 'Cuenta creada - OpenSupports',
                    'body' => self::userSystemEnabled('es')
                ],
                'de' => [
                    'subject' => 'Account erstellt - OpenSupports',
                    'body' => self::userSystemEnabled('de')
                ],
                'fr' => [
                    'subject' => 'Compte créé - OpenSupports',
                    'body' => self::userSystemEnabled('fr')
                ],
                'in' => [
                    'subject' => 'Akun telah dibuat - OpenSupports',
                    'body' => self::userSystemEnabled('in')
                ],
                'jp' => [
                    'subject' => 'アカウントが作成されました - OpenSupports',
                    'body' => self::userSystemEnabled('jp')
                ],
                'pt' => [
                    'subject' => 'Conta criada - OpenSupports',
                    'body' => self::userSystemEnabled('pt')
                ],
                'ru' => [
                    'subject' => 'Аккаунт создан - OpenSupports',
                    'body' => self::userSystemEnabled('ru')
                ],
                'tr' => [
                    'subject' => 'Hesap oluşturuldu - OpenSupports',
                    'body' => self::userSystemEnabled('tr')
                ],
                'cn' => [
                    'subject' => '帐户已创建 - OpenSupports',
                    'body' => self::userSystemEnabled('cn')
                ],
                'it' => [
                    'subject' => 'Account creato - OpenSupports',
                    'body' => self::userSystemEnabled('it')
                ]
            ],
            'TICKET_CREATED' => [
                'en' => [
                    'subject' => '#{{ticketNumber}} Ticket created - OpenSupports',
                    'body' => self::ticketCreated('en')
                ],
                'es' => [
                    'subject' => '#{{ticketNumber}} Ticket creado - OpenSupports',
                    'body' => self::ticketCreated('es')
                ],
                'de' => [
                    'subject' => '#{{ticketNumber}} Ticket erstellt - OpenSupports',
                    'body' => self::ticketCreated('de')
                ],
                'fr' => [
                    'subject' => '#{{ticketNumber}} Ticket créé - OpenSupports',
                    'body' => self::ticketCreated('fr')
                ],
                'in' => [
                    'subject' => '#{{ticketNumber}} tiket dibuat - OpenSupports',
                    'body' => self::ticketCreated('in')
                ],
                'jp' => [
                    'subject' => '#{{ticketNumber}} チケットが作成されました - OpenSupports',
                    'body' => self::ticketCreated('jp')
                ],
                'pt' => [
                    'subject' => '#{{ticketNumber}} Ticket criado - OpenSupports',
                    'body' => self::ticketCreated('pt')
                ],
                'ru' => [
                    'subject' => '#{{ticketNumber}} Создан билет - OpenSupports',
                    'body' => self::ticketCreated('ru')
                ],
                'tr' => [
                    'subject' => '#{{ticketNumber}} Bilet oluşturuldu - OpenSupports',
                    'body' => self::ticketCreated('tr')
                ],
                'cn' => [
                    'subject' => '#{{ticketNumber}} 已创建票证 - OpenSupports',
                    'body' => self::ticketCreated('cn')
                ],
                'it' => [
                    'subject' => '#{{ticketNumber}} ticket creato - OpenSupports',
                    'body' => self::ticketCreated('it')
                ]
            ],
            'TICKET_RESPONDED' => [
                'en' => [
                    'subject' => '#{{ticketNumber}} New response - OpenSupports',
                    'body' => self::ticketResponded('en')
                ],
                'es' => [
                    'subject' => '#{{ticketNumber}} Nueva respuesta - OpenSupports',
                    'body' => self::ticketResponded('es')
                ],
                'de' => [
                    'subject' => '#{{ticketNumber}} Neue Antwort - OpenSupports',
                    'body' => self::ticketResponded('de')
                ],
                'fr' => [
                    'subject' => '#{{ticketNumber}} Nouvelle réponse - OpenSupports',
                    'body' => self::ticketResponded('fr')
                ],
                'in' => [
                    'subject' => '#{{ticketNumber}} tanggapan baru - OpenSupports',
                    'body' => self::ticketResponded('in')
                ],
                'jp' => [
                    'subject' => '#{{ticketNumber}} 新しい応答 - OpenSupports',
                    'body' => self::ticketResponded('jp')
                ],
                'pt' => [
                    'subject' => '#{{ticketNumber}} Nova resposta - OpenSupports',
                    'body' => self::ticketResponded('pt')
                ],
                'ru' => [
                    'subject' => '#{{ticketNumber}} Новый ответ - OpenSupports',
                    'body' => self::ticketResponded('ru')
                ],
                'tr' => [
                    'subject' => '#{{ticketNumber}} Yeni yanıt - OpenSupports',
                    'body' => self::ticketResponded('tr')
                ],
                'cn' => [
                    'subject' => '#{{ticketNumber}} 新反应 - OpenSupports',
                    'body' => self::ticketResponded('cn')
                ],
                'it' => [
                    'subject' => '#{{ticketNumber}} Ticket risposto - OpenSupports',
                    'body' => self::ticketResponded('it')
                ]
            ],
            'TICKET_CLOSED' => [
                'en' => [
                    'subject' => '#{{ticketNumber}} Ticket closed - OpenSupports',
                    'body' => self::ticketClosed('en')
                ],
                'es' => [
                    'subject' => '#{{ticketNumber}} Ticket cerrado - OpenSupports',
                    'body' => self::ticketClosed('es')
                ],
                'de' => [
                    'subject' => '#{{ticketNumber}} Ticket geschlossen - OpenSupports',
                    'body' => self::ticketClosed('de')
                ],
                'fr' => [
                    'subject' => '#{{ticketNumber}} Billet fermé - OpenSupports',
                    'body' => self::ticketClosed('fr')
                ],
                'in' => [
                    'subject' => '#{{ticketNumber}} tiket ditutup - OpenSupports',
                    'body' => self::ticketClosed('in')
                ],
                'jp' => [
                    'subject' => '#{{ticketNumber}} チケットが閉じられました - OpenSupports',
                    'body' => self::ticketClosed('jp')
                ],
                'pt' => [
                    'subject' => '#{{ticketNumber}} Bilhete fechado - OpenSupports',
                    'body' => self::ticketClosed('pt')
                ],
                'ru' => [
                    'subject' => '#{{ticketNumber}} Билет закрыт - OpenSupports',
                    'body' => self::ticketClosed('ru')
                ],
                'tr' => [
                    'subject' => '#{{ticketNumber}} Bilet kapalı - OpenSupports',
                    'body' => self::ticketClosed('tr')
                ],
                'cn' => [
                    'subject' => '#{{ticketNumber}} 票已关闭 - OpenSupports',
                    'body' => self::ticketClosed('cn')
                ],
                'it' => [
                    'subject' => '#{{ticketNumber}} Ticket chiuso - OpenSupports',
                    'body' => self::ticketClosed('it')
                ]
            ],
            'TICKET_CREATED_STAFF' => [
                'en' => [
                    'subject' => '#{{ticketNumber}} Ticket created - OpenSupports',
                    'body' => self::ticketCreatedStaff('en')
                ],
                'es' => [
                    'subject' => '#{{ticketNumber}} Ticket creado - OpenSupports',
                    'body' => self::ticketCreatedStaff('es')
                ],
                'de' => [
                    'subject' => '#{{ticketNumber}} Ticket erstellt - OpenSupports',
                    'body' => self::ticketCreatedStaff('de')
                ],
                'fr' => [
                    'subject' => '#{{ticketNumber}} Ticket créé - OpenSupports',
                    'body' => self::ticketCreatedStaff('fr')
                ],
                'in' => [
                    'subject' => '#{{ticketNumber}} tiket dibuat - OpenSupports',
                    'body' => self::ticketCreatedStaff('in')
                ],
                'jp' => [
                    'subject' => '#{{ticketNumber}} チケットが作成されました - OpenSupports',
                    'body' => self::ticketCreatedStaff('jp')
                ],
                'pt' => [
                    'subject' => '#{{ticketNumber}} Ticket criado - OpenSupports',
                    'body' => self::ticketCreatedStaff('pt')
                ],
                'ru' => [
                    'subject' => '#{{ticketNumber}} Создан билет - OpenSupports',
                    'body' => self::ticketCreatedStaff('ru')
                ],
                'tr' => [
                    'subject' => '#{{ticketNumber}} Bilet oluşturuldu - OpenSupports',
                    'body' => self::ticketCreatedStaff('tr')
                ],
                'cn' => [
                    'subject' => '#{{ticketNumber}} 已创建票证 - OpenSupports',
                    'body' => self::ticketCreatedStaff('cn')
                ],
                'it' => [
                    'subject' => '#{{ticketNumber}} Ticket creato - OpenSupports',
                    'body' => self::ticketCreatedStaff('it')
                ]
            ]
        ];
    }

    public static function ticketClosed($language){
        global $mailTexts;
        $list = $mailTexts['ticketClosedList'];

        $ticketClosedMatches = [
            '{{Ticket_Closed_Match_1}}',
            '{{Ticket_Closed_Match_2}}',
            '{{Ticket_Closed_Match_3}}'
        ];

        return str_replace($ticketClosedMatches, $list[$language], file_get_contents('data/mail-templates/ticket-closed.html'));
    }

    public static function ticketCreatedStaff($language){
        global $mailTexts;
        $list = $mailTexts['ticketCreatedStaffList'];

        $ticketCreatedStaffMatches = [
            '{{Ticket_Created_Staff_Match_1}}',
            '{{Ticket_Created_Staff_Match_2}}',
            '{{Ticket_Created_Staff_Match_3}}',
            '{{Ticket_Created_Staff_Match_4}}'
        ];

        return str_replace($ticketCreatedStaffMatches, $list[$language], file_get_contents('data/mail-templates/ticket-created-staff.html'));
    }

    public static function ticketCreated($language){
        global $mailTexts;
        $list =  $mailTexts['ticketCreatedList'];

        $ticketCreatedMatches = [
            '{{Ticket_Created_Match_1}}',
            '{{Ticket_Created_Match_2}}',
            '{{Ticket_Created_Match_3}}',
            '{{Ticket_Created_Match_4}}'
        ];

        return str_replace($ticketCreatedMatches, $list[$language], file_get_contents('data/mail-templates/ticket-created.html'));
    }

    public static function ticketResponded($language){
        global $mailTexts;
        $list = $mailTexts['ticketRespondedList'];

        $ticketRespondedMatches = [
            '{{Ticket_Responded_Match_1}}',
            '{{Ticket_Responded_Match_2}}',
            '{{Ticket_Responded_Match_3}}',
            '{{Ticket_Responded_Match_4}}'
        ];

        return str_replace($ticketRespondedMatches, $list[$language], file_get_contents('data/mail-templates/ticket-responded.html'));
    }

    public static function userEditEmail($language){
        global $mailTexts;
        $list = $mailTexts['userEditEmailList'];

        $userEditEmailMatches = [
            '{{User_Edit_Email_Match_1}}',
            '{{User_Edit_Email_Match_2}}',
        ];

        return str_replace($userEditEmailMatches, $list[$language], file_get_contents('data/mail-templates/user-edit-email.html'));
    }

    public static function userEditPassword($language){
        global $mailTexts;
        $list = $mailTexts['userEditPasswordList'];

        $userEditPasswordMatches = [
            '{{User_Edit_Password_Match_1}}',
            '{{User_Edit_Password_Match_2}}',
        ];

        return str_replace($userEditPasswordMatches, $list[$language], file_get_contents('data/mail-templates/user-edit-password.html'));
    }

    public static function userPasswordForgot($language) {
        global $mailTexts;
        $list = $mailTexts['passwordForgotList'];

        $passwordForgotMatches = [
            '{{User_Password_Forgot_Match_1}}',
            '{{User_Password_Forgot_Match_2}}',
            '{{User_Password_Forgot_Match_3}}',
            '{{User_Password_Forgot_Match_4}}'
        ];

        return str_replace($passwordForgotMatches, $list[$language], file_get_contents('data/mail-templates/user-password-forgot.html'));
    }

    public static function userSignup($language) {
        global $mailTexts;
        $list = $mailTexts['userSignupList'];

        $userSignupMatches = [
            '{{User_Signup_Match_1}}',
            '{{User_Signup_Match_2}}',
            '{{User_Signup_Match_3}}',
            '{{User_Signup_Match_4}}'
        ];

        return str_replace($userSignupMatches, $list[$language], file_get_contents('data/mail-templates/user-signup.html'));
    }

    public static function userSystemDisabled($language) {
        global $mailTexts;
        $list = $mailTexts['userSystemDisabledList'];

        $userSystemDisabledMatches = [
            '{{User_System_Disabled_Match_1}}',
            '{{User_System_Disabled_Match_2}}',
            '{{User_System_Disabled_Match_3}}',
            '{{User_System_Disabled_Match_4}}'
        ];

        return str_replace($userSystemDisabledMatches, $list[$language], file_get_contents('data/mail-templates/user-system-disabled.html'));
    }

    public static function userSystemEnabled($language) {
        global $mailTexts;
        $list = $mailTexts['userSystemEnabledlist'];

        $userSystemEnabledMatches = [
            '{{User_System_Enabled_Match_1}}',
            '{{User_System_Enabled_Match_2}}',
            '{{User_System_Enabled_Match_3}}',
            '{{User_System_Enabled_Match_4}}'
        ];

        return str_replace($userSystemEnabledMatches, $list[$language], file_get_contents('data/mail-templates/user-system-enabled.html'));
    }
}
