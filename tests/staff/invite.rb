describe'/staff/invite' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should if data is wrong' do

        result = request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Tyrion Lannister',
            email: 'tyrion@opensupports.com',
            level: 5,
            profilePic: '',
            departments: '[1]'
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_LEVEL')
        
        result = request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Tyrion Lannister',
            email: 'tyrion@opensupports.com',
            level: 0,
            profilePic: '',
            departments: '[1]'
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_LEVEL')

        result = request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Tyrion Lannister',
            email: 'tyrion@opensupports.com',
            level: 1,
            profilePic: '',
            departments: '[1,100]'
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_DEPARTMENT')

        result = request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Tyrion Lannister',
            email: 'tyrion@opensupports.com',
            level: 1,
            profilePic: '',
            departments: 'xd'
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_DEPARTMENT')

        result = request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Tyrion LannisterLannisterLannisterLannisterLannisterLannisterLannisterLannisterLannisterLannisterLannisterLannisterLannisterLannisterLannisterLannisterLannisterLannisterLannisterLannisterLannisterLannister',
            email: 'tyrion@opensupports.com',
            level: 1,
            profilePic: '',
            departments: '[1]'
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')

        result = request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: '',
            email: 'tyrion@opensupports.com',
            level: 1,
            profilePic: '',
            departments: '[1]'
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')
    end

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
        (row['level']).should.equal(2)

        row = $database.getRow('department', 1, 'id')
        (row['owners']).should.equal(4)

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
        (row['owners']).should.equal(4)
    end
end
