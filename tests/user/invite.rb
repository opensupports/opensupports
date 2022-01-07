describe'/user/invite' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should if data is wrong' do

        result = request('/user/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: '',
            email: 'inviteduser2@opensupports.com'
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')
        
        result = request('/user/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'invited user invited user invited user invited user invited user invited user invited user invited user invited user invited user invited user invited user invited user invited user invited user invited user',
            email: 'inviteduser2@opensupports.com'
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')

        result = request('/user/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'invited user',
            email: 'inviiited user email'
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_EMAIL')

    end

    it 'should invite user' do

        result = request('/user/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'invited user',
            email: 'inviteduser2@opensupports.com'
        })
        
        (result['status']).should.equal('success')

        recoverpassword = $database.getRow('recoverpassword', 'inviteduser2@opensupports.com', 'email')

        request('/user/recover-password', {
            email: 'inviteduser2@opensupports.com',
            password: 'testpassword',
            token: recoverpassword['token']
        })

        row = $database.getRow('user', 'inviteduser2@opensupports.com', 'email')

        (row['name']).should.equal('invited user')
        (row['email']).should.equal('inviteduser2@opensupports.com')

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('INVITE')

    end
    it 'should fail if user is already exists' do
        result = request('/user/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'invited user',
            email: 'inviteduser2@opensupports.com'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('USER_EXISTS')
    end
end
