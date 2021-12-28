describe '/user/edit-email' do

    Scripts.logout()
    result = request('/user/login', {
        email: 'steve@jobs.com',
        password: 'custompassword'
    })

    $csrf_userid = result['data']['userId']
    $csrf_token = result['data']['token']


    it 'should fail if new email is incorrect' do
        result = request('/user/edit-email', {
            newEmail: 'newemail@jobscom',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_EMAIL')

        result = request('/user/edit-email', {
            newEmail: 'newemailjobs.com',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_EMAIL')
    end

    it 'should change email' do
        result = request('/user/edit-email', {
            newEmail: 'newemail@jobs.com',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        result = request('/user/edit-email', {
            newEmail: 'steve@jobs.com',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
    end


    it 'should success if email selected is used by himself' do

        Scripts.logout()

        Scripts.createUser('miare@os4.com','sellamamarlos', 'maria')
        
        result = request('/user/login', {
            email: 'miare@os4.com',
            password: 'sellamamarlos'
        })

        (result['status']).should.equal('success')
        
        $csrf_userid = result['data']['userId']
        $csrf_token = result['data']['token']

        row = $database.getRow('user', 'miare@os4.com', 'email')
        
        result = request('/user/edit-email', {
            newEmail: row['email'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        
        row = $database.getRow('user', 'miare@os4.com', 'email')

        (row['email']).should.equal('miare@os4.com')

    end

    it 'should fail if  email selected is already used' do

        staffRow = $database.getRow('staff', 1, 'id')
        userRow = $database.getRow('user', 1, 'id')

        result = request('/user/edit-email', {
            newEmail: staffRow['email'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_EMAIL')
        
        row = $database.getRow('user', 'miare@os4.com', 'email')
        (row['email']).should.equal('miare@os4.com')

        result = request('/user/edit-email', {
            newEmail: userRow['email'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_EMAIL')

        row = $database.getRow('user', 'miare@os4.com', 'email')
        (row['email']).should.equal('miare@os4.com')
    end
end
