describe'/staff/add' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should add staff member' do
        result= request('/staff/add', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Tyrion Lannister',
            email: 'tyrion@opensupports.com',
            password: 'testpassword',
            level: 2,
            profilePic: 'http://www.opensupports.com/profilepic.jpg',
            departments: '[1]'
        })

        (result['status']).should.equal('success')

        row = $database.getRow('staff', result['data']['id'], 'id')

        (row['name']).should.equal('Tyrion Lannister')
        (row['email']).should.equal('tyrion@opensupports.com')
        (row['profile_pic']).should.equal('http://www.opensupports.com/profilepic.jpg')
        (row['level']).should.equal('2')
    end
    it 'should fail if staff member is alrady a staff' do
        result= request('/staff/add', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Tyrion Lannister',
            email: 'tyrion@opensupports.com',
            password: 'testpassword',
            level: 2,
            profilePic: 'http://www.opensupports.com/profilepic.jpg',
            departments: '[1]'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('ALREADY_A_STAFF')

    end
end