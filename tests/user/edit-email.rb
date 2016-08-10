describe '/user/edit-email' do

    request('/user/logout')
    result = request('/user/login', {
        email: 'steve@jobs.com',
        password: 'newpassword'
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
        (result['message']).should.equal('Invalid email')

        result = request('/user/edit-email', {
            newEmail: 'newemailjobs.com',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
            })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('Invalid email')
    end

    it 'should change email' do
        result = request('/user/edit-email', {
            newEmail: 'newemail@jobs.com',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
            })
        (result['status']).should.equal('success')
    end
end
