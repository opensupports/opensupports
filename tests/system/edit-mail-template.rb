describe'system/edit-mail-template' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should edit mail template' do
            result= request('/system/edit-mail-template', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                language: 'en',
                templateType: 'USER_SIGNUP',
                subject: 'new subject',
                body: 'new message'
            })

            (result['status']).should.equal('success')

            row = $database.getRow('mailtemplate', 1, 'id')

            (row['subject']).should.equal('new subject')
            (row['body']).should.equal('new message')
        end
end
