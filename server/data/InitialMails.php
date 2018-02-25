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
                ],
                'de' => [
                    'subject' => 'Anmelden {{to}} - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-signup-de.html')
                ],
                'fr' => [
                    'subject' => 'S\'inscrire {{to}} - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-signup-fr.html')
                ],
                'in' => [
                    'subject' => 'Daftar - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-signup-in.html')
                ],
                'jp' => [
                    'subject' => 'サインアップ - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-signup-jp.html')
                ],
                'pt' => [
                    'subject' => 'Inscrever-se {{to}} - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-signup-pt.html')
                ],
                'ru' => [
                    'subject' => 'Зарегистрироваться {{to}} - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-signup-ru.html')
                ],
                'tr' => [
                    'subject' => 'kaydol {{to}} - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-signup-tr.html')
                ],
                'cn' => [
                    'subject' => '注册 {{to}} - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-signup-cn.html')
                ],
                'it' => [
                    'subject' => 'Sei iscritto {{to}} - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-signup-it.html')
                ],
                'nl' => [
                    'subject' => 'Aanmelden {{to}} - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-signup-nl.html')
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
                ],
                'de' => [
                    'subject' => 'Passwort bearbeitet - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-password-de.html')
                ],
                'fr' => [
                    'subject' => 'Mot de passe modifié - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-password-fr.html')
                ],
                'in' => [
                    'subject' => 'sandi diedit - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-password-in.html')
                ],
                'jp' => [
                    'subject' => 'パスワードの編集 - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-password-jp.html')
                ],
                'pt' => [
                    'subject' => 'Senha editada - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-password-pt.html')
                ],
                'ru' => [
                    'subject' => 'Пароль изменен - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-password-ru.html')
                ],
                'tr' => [
                    'subject' => 'Şifre düzenlendi - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-password-tr.html')
                ],
                'cn' => [
                    'subject' => '密码已编辑 - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-password-cn.html')
                ],
                'it' => [
                    'subject' => 'Password modificata - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-password-it.html')
                ],
                'nl' => [
                    'subject' => 'Wachtwoord is aangepast - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-password-nl.html')
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
                ],
                'de' => [
                    'subject' => 'E-Mail bearbeitet - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-email-de.html')
                ],
                'fr' => [
                    'subject' => 'Courrier électronique - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-email-fr.html')
                ],
                'in' => [
                    'subject' => 'email diedit - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-email-in.html')
                ],
                'jp' => [
                    'subject' => '電子メールを編集しました - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-email-jp.html')
                ],
                'pt' => [
                    'subject' => 'Email editado - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-email-pt.html')
                ],
                'ru' => [
                    'subject' => 'Сообщение изменено - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-email-ru.html')
                ],
                'tr' => [
                    'subject' => 'E-posta düzenlendi - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-email-tr.html')
                ],
                'cn' => [
                    'subject' => '电子邮件已修改 - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-email-cn.html')
                ],
                'it' => [
                    'subject' => 'E-mail modificata - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-email-it.html')
                ],
                'nl' => [
                    'subject' => 'E-mailadres is aangepast - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-edit-email-nl.html')
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
                ],
                'de' => [
                    'subject' => 'Passwort wiederherstellen - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-password-forgot-de.html')
                ],
                'fr' => [
                    'subject' => 'Récupérer mot de passe - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-password-forgot-fr.html')
                ],
                'in' => [
                    'subject' => 'memulihkan password - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-password-forgot-in.html')
                ],
                'jp' => [
                    'subject' => 'パスワードを回復 - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-password-forgot-jp.html')
                ],
                'pt' => [
                    'subject' => 'Recuperar senha - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-password-forgot-pt.html')
                ],
                'ru' => [
                    'subject' => 'Восстановить пароль - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-password-forgot-ru.html')
                ],
                'tr' => [
                    'subject' => 'Şifre kurtarma - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-password-forgot-tr.html')
                ],
                'cn' => [
                    'subject' => '恢复密码 - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-password-forgot-cn.html')
                ],
                'it' => [
                    'subject' => 'Recupera la password - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-password-forgot-it.html')
                ],
                'nl' => [
                    'subject' => 'Herstel wachtwoord - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-password-forgot-nl.html')
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
                ],
                'de' => [
                    'subject' => 'Access system changed - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-disabled-de.html')
                ],
                'fr' => [
                    'subject' => 'Système d\'accès modifié - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-disabled-fr.html')
                ],
                'in' => [
                    'subject' => 'sistem akses berubah - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-disabled-in.html')
                ],
                'jp' => [
                    'subject' => 'アクセスシステムが変更されました - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-disabled-jp.html')
                ],
                'pt' => [
                    'subject' => 'Sistema de acesso alterado - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-disabled-pt.html')
                ],
                'ru' => [
                    'subject' => 'Система доступа изменена - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-disabled-ru.html')
                ],
                'tr' => [
                    'subject' => 'Erişim sistemi değiştirildi - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-disabled-tr.html')
                ],
                'cn' => [
                    'subject' => '访问系统更改 - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-disabled-cn.html')
                ],
                'it' => [
                    'subject' => 'Il sistema di accesso è cambiato - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-disabled-it.html')
                ],
                'nl' => [
                    'subject' => 'Toegangssysteem gewijzigd - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-disabled-nl.html')
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
                ],
                'de' => [
                    'subject' => 'Account erstellt - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-enabled-de.html')
                ],
                'fr' => [
                    'subject' => 'Compte créé - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-enabled-fr.html')
                ],
                'in' => [
                    'subject' => 'Akun telah dibuat - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-enabled-in.html')
                ],
                'jp' => [
                    'subject' => 'アカウントが作成されました - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-enabled-jp.html')
                ],
                'pt' => [
                    'subject' => 'Conta criada - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-enabled-pt.html')
                ],
                'ru' => [
                    'subject' => 'Аккаунт создан - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-enabled-ru.html')
                ],
                'tr' => [
                    'subject' => 'Hesap oluşturuldu - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-enabled-tr.html')
                ],
                'cn' => [
                    'subject' => '帐户已创建 - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-enabled-cn.html')
                ],
                'it' => [
                    'subject' => 'Account creato - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-enabled-it.html')
                ],
                'nl' => [
                    'subject' => 'Account is aangemaakt - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/user-system-enabled-nl.html')
                ] 
            ],
            'TICKET_CREATED' => [
                'en' => [
                    'subject' => '#{{ticketNumber}} Ticket created - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-en.html')
                ],            
                'es' => [
                    'subject' => '#{{ticketNumber}} Ticket creado - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-es.html')
                ],
                'de' => [
                    'subject' => '#{{ticketNumber}} Ticket erstellt - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-de.html')
                ],
                'fr' => [
                    'subject' => '#{{ticketNumber}} Ticket créé - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-fr.html')
                ],
                'in' => [
                    'subject' => '#{{ticketNumber}} tiket dibuat - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-in.html')
                ],
                'jp' => [
                    'subject' => '#{{ticketNumber}} チケットが作成されました - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-jp.html')
                ],
                'pt' => [
                    'subject' => '#{{ticketNumber}} Ticket criado - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-pt.html')
                ],
                'ru' => [
                    'subject' => '#{{ticketNumber}} Создан билет - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-ru.html')
                ],
                'tr' => [
                    'subject' => '#{{ticketNumber}} Bilet oluşturuldu - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-tr.html')
                ],
                'cn' => [
                    'subject' => '#{{ticketNumber}} 已创建票证 - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-cn.html')
                ],
                'it' => [
                    'subject' => '#{{ticketNumber}} ticket creato - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-it.html')
                ],
                'nl' => [
                    'subject' => '#{{ticketNumber}} Incident aangemaakt - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-nl.html')
                ]  
            ],
            'TICKET_RESPONDED' => [
                'en' => [
                    'subject' => '#{{ticketNumber}} New response - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-responded-en.html')
                ],             
                'es' => [
                    'subject' => '#{{ticketNumber}} Nueva respuesta - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-responded-es.html')
                ],
                'de' => [
                    'subject' => '#{{ticketNumber}} Neue Antwort - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-responded-de.html')
                ],
                'fr' => [
                    'subject' => '#{{ticketNumber}} Nouvelle réponse - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-responded-fr.html')
                ],
                'in' => [
                    'subject' => '#{{ticketNumber}} tanggapan baru - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-responded-in.html')
                ],
                'jp' => [
                    'subject' => '#{{ticketNumber}} 新しい応答 - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-responded-jp.html')
                ],
                'pt' => [
                    'subject' => '#{{ticketNumber}} Nova resposta - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-responded-pt.html')
                ],
                'ru' => [
                    'subject' => '#{{ticketNumber}} Новый ответ - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-responded-ru.html')
                ],
                'tr' => [
                    'subject' => '#{{ticketNumber}} Yeni yanıt - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-responded-tr.html')
                ],
                'cn' => [
                    'subject' => '#{{ticketNumber}} 新反应 - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-responded-cn.html')
                ],
                'it' => [
                    'subject' => '#{{ticketNumber}} Ticket risposto - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-responded-it.html')
                ],
                'nl' => [
                    'subject' => '#{{ticketNumber}} Nieuw antwoord - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-responded-nl.html')
                ] 
            ],
            'TICKET_CLOSED' => [
                'en' => [
                    'subject' => '#{{ticketNumber}} Ticket closed - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-closed-en.html')
                ],        
                'es' => [
                    'subject' => '#{{ticketNumber}} Ticket cerrado - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-closed-es.html')
                ],
                'de' => [
                    'subject' => '#{{ticketNumber}} Ticket geschlossen - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-closed-de.html')
                ],
                'fr' => [
                    'subject' => '#{{ticketNumber}} Billet fermé - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-closed-fr.html')
                ],
                'in' => [
                    'subject' => '#{{ticketNumber}} tiket ditutup - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-closed-in.html')
                ],
                'jp' => [
                    'subject' => '#{{ticketNumber}} チケットが閉じられました - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-closed-jp.html')
                ],
                'pt' => [
                    'subject' => '#{{ticketNumber}} Bilhete fechado - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-closed-pt.html')
                ],
                'ru' => [
                    'subject' => '#{{ticketNumber}} Билет закрыт - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-closed-ru.html')
                ],
                'tr' => [
                    'subject' => '#{{ticketNumber}} Bilet kapalı - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-closed-tr.html')
                ],
                'cn' => [
                    'subject' => '#{{ticketNumber}} 票已关闭 - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-closed-cn.html')
                ],
                'it' => [
                    'subject' => '#{{ticketNumber}} Ticket chiuso - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-closed-it.html')
                ],
                'nl' => [
                    'subject' => '#{{ticketNumber}} Incident gesloten - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-closed-nl.html')
                ]  
            ],
            'TICKET_CREATED_STAFF' => [
                'en' => [
                    'subject' => '#{{ticketNumber}} Ticket created - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-staff-en.html')
                ],      
                'es' => [
                    'subject' => '#{{ticketNumber}} Ticket creado - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-staff-es.html')
                ],
                'de' => [
                    'subject' => '#{{ticketNumber}} Ticket erstellt - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-staff-de.html')
                ],
                'fr' => [
                    'subject' => '#{{ticketNumber}} Ticket créé - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-staff-fr.html')
                ],
                'in' => [
                    'subject' => '#{{ticketNumber}} tiket dibuat - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-staff-in.html')
                ],
                'jp' => [
                    'subject' => '#{{ticketNumber}} チケットが作成されました - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-staff-jp.html')
                ],
                'pt' => [
                    'subject' => '#{{ticketNumber}} Ticket criado - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-staff-pt.html')
                ],
                'ru' => [
                    'subject' => '#{{ticketNumber}} Создан билет - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-staff-ru.html')
                ],
                'tr' => [
                    'subject' => '#{{ticketNumber}} Bilet oluşturuldu - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-staff-tr.html')
                ],
                'cn' => [
                    'subject' => '#{{ticketNumber}} 已创建票证 - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-staff-cn.html')
                ],
                'it' => [
                    'subject' => '#{{ticketNumber}} Ticket creato - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-staff-it.html')
                ],
                'nl' => [
                    'subject' => '#{{ticketNumber}} Incident aangemaakt - OpenSupports',
                    'body' => file_get_contents('data/mail-templates/ticket-created-staff-nl.html')
                ] 
            ]
        ];
    }
}
