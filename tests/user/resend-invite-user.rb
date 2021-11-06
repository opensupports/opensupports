describe'/user/resend-invite-user' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should if data is wrong' do

        result = request('/user/resend-invite-user', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            email: 'invalid email'
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_EMAIL')
        
        result = request('/user/resend-invite-user', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            email: 'thisemaildoesnotexists@opensupports.com'
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_EMAIL')

    end

    it 'should resend invite user' do
        
        result = request('/user/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'inviteduser3',
            email: 'inviteduser3@opensupports.com'
        })
        
        result = request('/user/resend-invite-user', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            email: 'inviteduser3@opensupports.com'
        })
        
        (result['status']).should.equal('success')
    end
end
