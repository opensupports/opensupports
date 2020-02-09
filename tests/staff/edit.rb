describe'/staff/edit' do
    request('/user/logout')
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
        (row['level']).should.equal('1')

        rows = $database.getRow('department_staff', staffId, 'staff_id')

        (rows['department_id']).should.equal('1')

        row = $database.getRow('department', 1, 'id')
        (row['owners']).should.equal('4')

        row = $database.getRow('department', 2, 'id')
        (row['owners']).should.equal('3')
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
        (row['level']).should.equal('2')
        (row['send_email_on_new_ticket']).should.equal('0')

        row = $database.getRow('department', 1, 'id')
        (row['owners']).should.equal('5')

        row = $database.getRow('department', 2, 'id')
        (row['owners']).should.equal('4')

        row = $database.getRow('department', 3, 'id')
        (row['owners']).should.equal('2')

        Scripts.logout()
        Scripts.login('ayra2@opensupports.com', 'starkpassword', true)
        result = request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            sendEmailOnNewTicket: 1
        })
        (result['status']).should.equal('success')
        row = $database.getRow('staff', 'Arya Stark', 'name')
        (row['send_email_on_new_ticket']).should.equal('1')
    end

    it 'should fail if is not staff logged' do

        request('/user/logout')

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
end
