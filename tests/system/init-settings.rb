describe '/system/init-settings' do
    it 'should prevent initing database if already called' do
      result = request('/system/init-database', {})
      (result['status']).should.equal('fail')
      (result['message']).should.equal('INIT_SETTINGS_DONE')

      result = request('/system/check-requirements', {})
      (result['status']).should.equal('success')

      result = request('/system/init-database', {})
      (result['status']).should.equal('fail')
      (result['message']).should.equal('INIT_SETTINGS_DONE')
    end

    it 'should initialize correctly' do
        result = request('/system/init-settings', {
            'user-system-enabled' => true,
            'registration' => true,
            'title' => 'Support Center',
            'imap-host' => '{imap.dreamhost.com:993/imap/ssl}INBOX',
            'imap-user' => "support@opensupports.com",
            'imap-pass' => "gotaxc22",
            'imap-user' => 'support@opensupports.com',
            'imap-pass' => '',
            'smtp-host' => 'localhost',
            'smtp-port' => 7070,
            'smtp-user' => 'support@opensupports.com',
            'smtp-password' => '',
            'server-email' => 'support@opensupports.com',
            'language' => 'en'
        })

        (result['status']).should.equal('success')

        lang = $database.getRow('setting', 'language', 'name')
        (lang['value']).should.equal('en')

        result = request('/system/init-admin', {
            name: 'Emilia Clarke',
            email: $staff[:email],
            password: $staff[:password]
        })

        (result['status']).should.equal('success')
    end
end
