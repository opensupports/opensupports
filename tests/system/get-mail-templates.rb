describe'system/get-mail-templates' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should get mail templates' do
            result= request('/system/get-mail-templates', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            (result['status']).should.equal('success')

            (result['data'].size).should.equal(110)
        end
end
