describe'/staff/edit' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should edit another staff member' do
        staffId = $database.getRow('staff','tyrion@opensupports.com','email')['id']
        result= request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            email: 'LittleLannister@opensupports.com',
            level: 1,
            departments: '[1, 2]',
            staffId: staffId
        })

        (result['status']).should.equal('success')

        row = $database.getRow('staff', staffId, 'id')

        (row['email']).should.equal('littlelannister@opensupports.com')
        (row['level']).should.equal(1)

        rows = $database.getRow('department_staff', staffId, 'staff_id')

        (rows['department_id']).should.equal(1)

        row = $database.getRow('department', 1, 'id')
        (row['owners']).should.equal(4)

        row = $database.getRow('department', 2, 'id')
        (row['owners']).should.equal(3)
    end

    it 'should edit own data staff' do
        request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Arya Stark',
            email: 'arya@opensupports.com',
            level: 1,
            profilePic: '',
            departments: '[1]'
        })

        recoverpassword = $database.getRow('recoverpassword', 'arya@opensupports.com', 'email')

        request('/user/recover-password', {
            email: 'arya@opensupports.com',
            password: 'starkpassword',
            token: recoverpassword['token']
        })

        row = $database.getRow('staff', 'arya@opensupports.com', 'email')

        result = request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            staffId: row['id'],
            email: 'ayra2@opensupports.com',
            departments: '[1, 2, 3]',
            sendEmailOnNewTicket: 1,
            level: 2
        })

        (result['status']).should.equal('success')

        row = $database.getRow('staff', 'Arya Stark', 'name')

        (row['email']).should.equal('ayra2@opensupports.com')
        (row['level']).should.equal(2)
        (row['send_email_on_new_ticket']).should.equal(0)

        row = $database.getRow('department', 1, 'id')
        (row['owners']).should.equal(5)

        row = $database.getRow('department', 2, 'id')
        (row['owners']).should.equal(4)

        row = $database.getRow('department', 3, 'id')
        (row['owners']).should.equal(2)

        Scripts.logout()
        Scripts.login('ayra2@opensupports.com', 'starkpassword', true)
        result = request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            sendEmailOnNewTicket: 1
        })
        (result['status']).should.equal('success')
        row = $database.getRow('staff', 'Arya Stark', 'name')
        (row['send_email_on_new_ticket']).should.equal(1)
    end

    it 'should fail if is not staff logged' do

        Scripts.logout()

        result = request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            staffId: 1,
            email:  'stafffalse@opensupports.com',
            departments: '[1, 2]',
            sendEmailOnNewTicket: 1
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
    end

    it 'should success if email selected is used by himself' do

        Scripts.login($staff[:email], $staff[:password], true)
        
        result = request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'sellamamarlos',
            email: 'dalas@os4.com',
            level: 2,
            profilePic: '',
            departments: '[1]'
        })

        row = $database.getRow('staff', 'dalas@os4.com', 'email')
        
        result = request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            staffId: row['id'],
            email:  row['email']
        })

        (result['status']).should.equal('success')
        
        staffRow = $database.getRow('staff', 'dalas@os4.com', 'email')

        (staffRow['email']).should.equal('dalas@os4.com')

    end

    it 'should fail if  email selected is already used' do

        staffRow = $database.getRow('staff', 'dalas@os4.com', 'email')
        
        result = request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'sellamamarlos',
            email: 'dalas2@os4.com',
            level: 2,
            profilePic: '',
            departments: '[1]'
        })

        staffRow2 = $database.getRow('staff', 'dalas2@os4.com', 'email')
        userRow = $database.getRow('user', 'miare@os4.com', 'email')

        result = request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            staffId: staffRow['id'],
            email:  staffRow2['email'],
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_EMAIL')
        
        result = request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            staffId: staffRow['id'],
            email:  userRow['email'],
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_EMAIL')
    end
end
