describe'/staff/invite' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should add staff member' do

        result = request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Tyrion Lannister',
            email: 'tyrion@opensupports.com',
            level: 2,
            profilePic: '',
            departments: '[1]'
        })
        (result['status']).should.equal('success')

        recoverpassword = $database.getRow('recoverpassword', 'tyrion@opensupports.com', 'email')

        request('/user/recover-password', {
            email: 'tyrion@opensupports.com',
            password: 'testpassword',
            token: recoverpassword['token']
        })

        row = $database.getRow('staff', result['data']['id'], 'id')

        (row['name']).should.equal('Tyrion Lannister')
        (row['email']).should.equal('tyrion@opensupports.com')
        (row['profile_pic']).should.equal('')
        (row['level']).should.equal('2')

        row = $database.getRow('department', 1, 'id')
        (row['owners']).should.equal('4')

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('INVITE')

    end
    it 'should fail if staff member is alrady a staff' do
        result = request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Tyrion Lannister',
            email: 'tyrion@opensupports.com',
            level: 2,
            profilePic: '',
            departments: '[1]'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('ALREADY_A_STAFF')

        row = $database.getRow('department', 1, 'id')
        (row['owners']).should.equal('4')
    end
end
