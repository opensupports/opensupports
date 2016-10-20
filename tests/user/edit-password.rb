describe '/user/edit-password' do

    request('/user/logout')
    result = request('/user/login', {
        email: 'steve@jobs.com',
        password: 'custom'
    })

    $csrf_userid = result['data']['userId']
    $csrf_token = result['data']['token']


    it 'should fail if new password is incorrect' do
        result = request('/user/edit-password', {
            oldPassword: 'custom',
            newPassword: 'np',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_PASSWORD')

        long_text = ''
        250.times {long_text << 'a'}

        result = request('/user/edit-password', {
            oldPassword: 'custom',
            newPassword: long_text,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_PASSWORD')
    end

    it 'should fail if old password is not same than old password ' do
        result = request('/user/edit-password',{
            oldPassword: 'falsepassword',
            newPassword: 'newpassword',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_OLD_PASSWORD')
    end

    it 'should change password' do
        result = request('/user/edit-password',{
            oldPassword: 'custom',
            newPassword: 'newpassword',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')
    end
end
