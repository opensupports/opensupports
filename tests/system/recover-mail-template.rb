describe'system/recover-mail-template' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should recover mail template' do
            result= request('/system/recover-mail-template', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                language: 'en',
                templateType: 'USER_SIGNUP',
            })

            (result['status']).should.equal('success')

            row = $database.getRow('mailtemplate', 1, 'id')
            
            (row['subject']).should.equal('Signup {{to}} - OpenSupports')
        end
end
