describe'system/edit-settings' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should edit settings' do
        result = request('/system/edit-settings', {
            "csrf_userid" => $csrf_userid,
            "csrf_token" => $csrf_token,
            "maintenance-mode" => 0,
            "layout" => 'full-width',
            "allow-attachments" => 1,
            "max-size" => 2,
            "language" => 'en',
            "server-email" => 'testemail@hotmail.com',
            "default-is-locked" => 1
        })

        (result['status']).should.equal('success')

        row = $database.getRow('setting', 'maintenance-mode', 'name')
        (row['value']).should.equal('0')

        row = $database.getRow('setting', 'layout', 'name')
        (row['value']).should.equal('full-width')

        row = $database.getRow('setting', 'max-size', 'name')
        (row['value']).should.equal('2')

        row = $database.getRow('setting', 'language', 'name')
        (row['value']).should.equal('en')

        row = $database.getRow('setting', 'server-email', 'name')
        (row['value']).should.equal('testemail@hotmail.com')
        row = $database.getRow('setting', 'default-is-locked', 'name')
        (row['value']).should.equal('1')
        Scripts.logout()
    end
    it 'should fail if supported languages are invalid' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        result= request('/system/edit-settings', {
            "csrf_userid" => $csrf_userid,
            "csrf_token" => $csrf_token,
            "supportedLanguages" => '["en", "pt", "jp", "ru", "de"]',
            "allowedLanguages" => '["en", "pt", "jp", "ru"]'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_SUPPORTED_LANGUAGES')
    end
    it 'should change allowed and supported languages' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        result= request('/system/edit-settings', {
            "csrf_userid" => $csrf_userid,
            "csrf_token" => $csrf_token,
            "supportedLanguages" => '["en", "pt", "jp", "ru"]',
            "allowedLanguages" => '["en", "pt", "jp", "ru", "de"]'
        })

        (result['status']).should.equal('success')

        row = $database.getRow('language', 'en', 'code')
        (row['supported']).should.equal(1)

        row = $database.getRow('language', 'pt', 'code')
        (row['supported']).should.equal(1)

        row = $database.getRow('language', 'jp', 'code')
        (row['supported']).should.equal(1)

        row = $database.getRow('language', 'ru', 'code')
        (row['supported']).should.equal(1)

        row = $database.getRow('language', 'en', 'code')
        (row['allowed']).should.equal(1)

        row = $database.getRow('language', 'pt', 'code')
        (row['allowed']).should.equal(1)

        row = $database.getRow('language', 'jp', 'code')
        (row['allowed']).should.equal(1)

        row = $database.getRow('language', 'ru', 'code')
        (row['allowed']).should.equal(1)

        row = $database.getRow('language', 'de', 'code')
        (row['allowed']).should.equal(1)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('EDIT_SETTINGS')


        Scripts.updateLockedDepartmentSetting(0)
        Scripts.logout()
    end

    it 'should delete ticket when user table is not created' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        Scripts.createTicket('TicketToDeleteWithoutUsersCreated')
        ticket = $database.getRow('ticket', 'TicketToDeleteWithoutUsersCreated', 'title')

        result = request('/ticket/delete', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')
    end

end
