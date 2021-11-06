describe 'Mail templates' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    describe 'system/get-mail-template' do

        it 'should get USER_SIGNUP mail template' do
            result = request('/system/get-mail-template', {
                template: 'USER_SIGNUP',
                language: 'en',
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            (result['status']).should.equal('success')
            (result['data']['template']).should.equal('USER_SIGNUP')
            (result['data']['subject']).should.equal('Signup {{to}} - OpenSupports')
            (result['data']['text1']).should.equal('Verify your account')
            (result['data']['text2']).should.equal('Welcome to our support center, {{name}}!. We need you to verify this email in order to get access to your account.')
            (result['data']['text3']).should.equal('Use this code in {{url}}/verify-token/{{to}}/{{verificationToken}} or click the button below.')
        end

        it 'should get USER_EMAIL mail template' do
            result = request('/system/get-mail-template', {
                template: 'USER_EMAIL',
                language: 'de',
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            (result['status']).should.equal('success')
            (result['data']['template']).should.equal('USER_EMAIL')
            (result['data']['subject']).should.equal('E-Mail bearbeitet - OpenSupports')
            (result['data']['text1']).should.equal('E-Mail geändert')
            (result['data']['text2']).should.equal('Hallo, {{name}}. Wir möchten Sie darüber informieren, dass Ihre E-Mail von Ihrem Kundenbereich zu {{newemail}} geändert wurde.')
            (result['data']['text3']).should.equal('')
        end

        it 'should not get mail template if language or type invalid' do
            result = request('/system/get-mail-template', {
                template: 'USER_EMAILS',
                language: 'de',
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_TEMPLATE')

            result = request('/system/get-mail-template', {
                template: 'USER_EMAIL',
                language: 'wa',
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_TEMPLATE')
        end
    end

    describe 'system/edit-mail-template' do

        it 'should edit mail template' do
            result = request('/system/edit-mail-template', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                language: 'en',
                template: 'USER_SIGNUP',
                subject: 'new subject',
                text1: 'new text1',
                text2: 'new text2 {{name}}',
                text3: 'new text3 {{url}}/verify-token/{{to}}/{{verificationToken}}',
            })

            (result['status']).should.equal('success')

            row = $database.getRow('mailtemplate', 1, 'id')

            (row['template']).should.equal('USER_SIGNUP')
            (row['subject']).should.equal('new subject')
            (row['text1']).should.equal('new text1')
            (row['text2']).should.equal('new text2 {{name}}')
            (row['text3']).should.equal('new text3 {{url}}/verify-token/{{to}}/{{verificationToken}}')
        end

        it 'should fail if one of the texts has invalid syntax' do
            result = request('/system/edit-mail-template', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                language: 'en',
                template: 'USER_SIGNUP',
                subject: 'new subject',
                text1: 'new text1',
                text2: 'new text2',
                text3: 'new text3 {{url}}/verify-token/{{to}}/{{verificationToken}}',
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_TEXT_2')

            row = $database.getRow('mailtemplate', 1, 'id')

            (row['template']).should.equal('USER_SIGNUP')
            (row['subject']).should.equal('new subject')
            (row['text1']).should.equal('new text1')
            (row['text2']).should.equal('new text2 {{name}}')
            (row['text3']).should.equal('new text3 {{url}}/verify-token/{{to}}/{{verificationToken}}')
        end

    end

    describe 'system/recover-mail-template' do

        it 'should recover mail template' do
            result = request('/system/recover-mail-template', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                language: 'en',
                template: 'USER_SIGNUP',
            })

            (result['status']).should.equal('success')

            row = $database.getRow('mailtemplate', 1, 'id')

            (row['template']).should.equal('USER_SIGNUP')
            (row['subject']).should.equal('Signup {{to}} - OpenSupports')
            (row['text1']).should.equal('Verify your account')
            (row['text2']).should.equal('Welcome to our support center, {{name}}!. We need you to verify this email in order to get access to your account.')
            (row['text3']).should.equal('Use this code in {{url}}/verify-token/{{to}}/{{verificationToken}} or click the button below.')
        end
    end
end
