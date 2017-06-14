describe '/system/init-settings' do
    it 'should initialize correctly' do
        result = request('/system/init-settings', {
            'user-system-enabled' => true,
            'registration' => true,
            'title' => 'Support Center',
            'smtp-host' => 'localhost',
            'smtp-port' => 7070,
            'smtp-user' => 'noreply@opensupports.com',
            'smtp-password' => '',
            'no-reply-email' => 'noreply@opensupports.com',
            'language' => 'en'
        })

        lang = $database.getRow('setting', 'language', 'name')

        (result['status']).should.equal('success')
        (lang['value']).should.equal('en')

        result = request('/system/init-admin', {
            name: 'Emilia Clarke',
            email: $staff[:email],
            password: $staff[:password]
        })

        (result['status']).should.equal('success')
    end
end