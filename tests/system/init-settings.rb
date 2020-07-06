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
            'registration' => true,
            'title' => 'Support Center',
            'smtp-host' => 'localhost:7070',
            'smtp-user' => 'testemail@opensupports.com',
            'smtp-pass' => 'password',
            'server-email' => 'testemail@opensupports.com',
            'language' => 'en',
            'mandatory-login' => true
        })

        (result['status']).should.equal('success')

        lang = $database.getRow('setting', 'language', 'name')
        (lang['value']).should.equal('en')
        
        default = $database.getRow('setting', 'default-department-id', 'name')
        (default['value']).should.equal('1')

        locked = $database.getRow('setting', 'default-is-locked', 'name')
        (locked['value']).should.equal('0')

        result = request('/system/init-admin', {
            name: 'Emilia Clarke',
            email: $staff[:email],
            password: $staff[:password]
        })

        (result['status']).should.equal('success')
    end
end
