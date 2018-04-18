describe'/staff/edit' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should edit another staff member' do
        result= request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            email: 'LittleLannister@opensupports.com',
            level: 1,
            departments: '[1, 2]',
            staffId: 3
        })

        (result['status']).should.equal('success')

        row = $database.getRow('staff', 3, 'id')

        (row['email']).should.equal('LittleLannister@opensupports.com')
        (row['level']).should.equal('1')

        rows = $database.getRow('department_staff', 3, 'staff_id')

        (rows['department_id']).should.equal('1')

        row = $database.getRow('department', 1, 'id')
        (row['owners']).should.equal('3')

        row = $database.getRow('department', 2, 'id')
        (row['owners']).should.equal('2')

    end

    it 'should edit staff member ' do
        request('/staff/add', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Arya Stark',
            password: 'starkpassword',
            email: 'arya@opensupports.com',
            level: 2,
            profilePic: '',
            departments: '[1]'
        })

        row = $database.getRow('staff', 'Arya Stark', 'name')

        result = request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            staffId: row['id'],
            email: 'ayra2@opensupports.com',
            departments: '[1, 2, 3]',
            sendEmailOnNewTicket: 1
        })

        (result['status']).should.equal('success')

        row = $database.getRow('staff', 'Arya Stark', 'name')

        (row['email']).should.equal('ayra2@opensupports.com')
        (row['level']).should.equal('2')
        (row['send_email_on_new_ticket']).should.equal('0')

        row = $database.getRow('department', 1, 'id')
        (row['owners']).should.equal('4')

        row = $database.getRow('department', 2, 'id')
        (row['owners']).should.equal('3')

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
end
