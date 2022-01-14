describe'/staff/resend-invite-staff' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should if data is wrong' do

        result = request('/staff/resend-invite-staff', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            email: 'invalid email'
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_EMAIL')
        
        result = request('/staff/resend-invite-staff', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            email: 'thisemaildoesnotexists@opensupports.com'
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_EMAIL')

    end

    it 'should resend invite staff' do

        request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'invented name',
            email: 'invitedstaff2@opensupports.com',
            level: 2,
            profilePic: '',
            departments: '[1]'
        })

        result = request('/staff/resend-invite-staff', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            email: 'invitedstaff2@opensupports.com'
        })
        
        (result['status']).should.equal('success')
    end
end
