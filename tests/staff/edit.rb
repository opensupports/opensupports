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
            staffId: 2
        })

        (result['status']).should.equal('success')

        row = $database.getRow('staff', 2, 'id')

        (row['email']).should.equal('LittleLannister@opensupports.com')
        (row['level']).should.equal('1')

        rows = $database.getRow('department_staff', 2, 'staff_id')

        (rows['department_id']).should.equal('1')

    end

    it 'should edit staff member ' do
        request('/staff/add', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Arya Stark',
            password: 'starkpassword',
            email: 'arya@opensupports.com',
            level: 2,
            profilePic: 'http://www.opensupports.com/profilepic.jpg',
            departments: '[1]'
        })
        request('/user/logout')
        Scripts.login('arya@opensupports.com', 'starkpassword', true)

        result = request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            email: 'newwstaff@opensupports.com',
        })

        (result['status']).should.equal('success')

        row = $database.getRow('staff', $csrf_userid, 'id')

        (row['email']).should.equal('newwstaff@opensupports.com')
        (row['level']).should.equal('2')

    end
end