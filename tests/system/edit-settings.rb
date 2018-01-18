describe'system/edit-settings' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should edit settings' do
        result= request('/system/edit-settings', {
            "csrf_userid" => $csrf_userid,
            "csrf_token" => $csrf_token,
            "maintenance-mode" => 0,
            "time-zone" => -3,
            "layout" => 'full-width',
            "allow-attachments" => 1,
            "max-size" => 2048,
            "language" => 'en',
            "no-reply-email" => 'testemail@hotmail.com'
        })

        (result['status']).should.equal('success')

        row = $database.getRow('setting', 'maintenance-mode', 'name')
        (row['value']).should.equal('0')

        row = $database.getRow('setting', 'time-zone', 'name')
        (row['value']).should.equal('-3')

        row = $database.getRow('setting', 'layout', 'name')
        (row['value']).should.equal('full-width')

        row = $database.getRow('setting', 'max-size', 'name')
        (row['value']).should.equal('2048')

        row = $database.getRow('setting', 'language', 'name')
        (row['value']).should.equal('en')

        row = $database.getRow('setting', 'no-reply-email', 'name')
        (row['value']).should.equal('testemail@hotmail.com')

        request('/user/logout')
    end
    it 'should change allowed and supported languages' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)

        result= request('/system/edit-settings', {
            "csrf_userid" => $csrf_userid,
            "csrf_token" => $csrf_token,
            "supportedLanguages" => '["en", "pt", "jp", "ru"]',
            "allowedLanguages" => '["en","pt", "jp", "ru", "de"]'
        })

        (result['status']).should.equal('success')

        row = $database.getRow('language', 'en', 'code')
        (row['supported']).should.equal('1')

        row = $database.getRow('language', 'pt', 'code')
        (row['supported']).should.equal('1')

        row = $database.getRow('language', 'jp', 'code')
        (row['supported']).should.equal('1')

        row = $database.getRow('language', 'ru', 'code')
        (row['supported']).should.equal('1')

        row = $database.getRow('language', 'en', 'code')
        (row['allowed']).should.equal('1')

        row = $database.getRow('language', 'pt', 'code')
        (row['allowed']).should.equal('1')

        row = $database.getRow('language', 'jp', 'code')
        (row['allowed']).should.equal('1')

        row = $database.getRow('language', 'ru', 'code')
        (row['allowed']).should.equal('1')

        row = $database.getRow('language', 'de', 'code')
        (row['allowed']).should.equal('1')

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('EDIT_SETTINGS')

        request('/user/logout')
    end
end
