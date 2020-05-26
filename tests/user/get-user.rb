describe '/user/get-user' do

    request('/user/logout')
    result = request('/user/login', {
        email: 'staff@opensupports.com',
        password: 'staff',
        staff: true
    })

    $csrf_userid = result['data']['userId']
    $csrf_token = result['data']['token']

    it 'should get user data' do
        result = request('/user/get-user', {
            userId: 4,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        user = $database.getRow('user', 4 , 'id')
        (user['email']).should.equal(result['data']['email'])
        (user['signup_date']).should.equal(result['data']['signupDate'].to_i)
        (user['name']).should.equal(result['data']['name'])
        (user['tickets']).should.equal(result['data']['tickets'].size)
    end

end