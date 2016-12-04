describe '/user/delete' do

    request('/user/logout')
    result = request('/user/login', {
        email: 'staff@opensupports.com',
        password: 'staff',
        staff: true
    })

    $csrf_userid = result['data']['userId']
    $csrf_token = result['data']['token']

    it 'should delete user' do
        result = request('/user/delete', {
            userId: 4,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        user = $database.getRow('user', 4 , 'id')
        (user).should.equal(nil)

    end
end


