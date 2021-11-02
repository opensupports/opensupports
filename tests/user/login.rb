describe '/user/login' do
    @loginEmail = 'login@os4.com'
    @loginPass = 'loginpass'

    Scripts.createUser(@loginEmail, @loginPass)

    it 'should fail if password is incorrect' do
        result = request('/user/login', {
            email: @loginEmail,
            password: 'some_incorrect_password'
        })
        (result['status']).should.equal('fail')
    end

    it 'should login correctly' do
        result = request('/user/login', {
            email: @loginEmail,
            password: @loginPass
        })
        (result['status']).should.equal('success')
    end

    it 'should not fail if already logged in' do
        result = request('/user/login', {
            email: @loginEmail,
            password: @loginPass
        })
        (result['status']).should.equal('success')
    end

    it 'should login staff member' do
        Scripts.logout()
        result = request('/user/login', {
            email: $staff[:email],
            password: $staff[:password],
            staff: 1
        })
        (result['status']).should.equal('success')
        (result['data']['staff']).should.equal(true)
    end

    it 'should work autologin user with remember token' do
        Scripts.logout()
        result = request('/user/login', {
            email: @loginEmail,
            password: @loginPass,
            staff: 0,
            remember: 1
        })
        (result['status']).should.equal('success')

        @rememberToken = result['data']['rememberToken']
        @userId = result['data']['userId']

        Scripts.logout()
        result = request('/user/login', {
            userId: @userId,
            rememberToken: '12abc',
            staff: 0,
            remember: 1
        })
        (result['status']).should.equal('fail')

        result = request('/user/login', {
            userId: 1,
            rememberToken: @rememberToken,
            staff: 0,
            remember: 1
        })
        (result['status']).should.equal('fail')

        result = request('/user/login', {
            userId: @userId,
            rememberToken: @rememberToken,
            staff: 0,
            remember: 1
        })
        (result['status']).should.equal('success')
    end

    it 'should work autologin staff with remember token' do
        Scripts.logout()
        result = request('/user/login', {
            email: $staff[:email],
            password: $staff[:password],
            staff: 1,
            remember: 1
        })
        (result['status']).should.equal('success')

        @rememberToken = result['data']['rememberToken']
        @staffId = result['data']['userId']

        Scripts.logout()
        result = request('/user/login', {
            userId: @staffId,
            rememberToken: '12abc',
            staff: 1,
            remember: 1
        })
        (result['status']).should.equal('fail')

        result = request('/user/login', {
            userId: 3,
            rememberToken: @rememberToken,
            staff: 1,
            remember: 1
        })
        (result['status']).should.equal('fail')

        result = request('/user/login', {
            userId: @staffId,
            rememberToken: @rememberToken,
            staff: 1,
            remember: 1
        })
        (result['status']).should.equal('success')

        $csrf_userid = result['data']['userId']
        $csrf_token = result['data']['token']
    end

    it 'should logout if user is logged in'do
        result = request('/user/logout', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')
    end

    it 'should fail logout if user is not logged in' do
        result = request('/user/logout', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
    end
end
