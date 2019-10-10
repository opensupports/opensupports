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

    it 'should fail if already logged in' do
        result = request('/user/login', {
            email: @loginEmail,
            password: @loginPass
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('SESSION_EXISTS')
    end

    it 'should login staff member' do
        request('/user/logout', {})
        result = request('/user/login', {
            email: $staff[:email],
            password: $staff[:password],
            staff: true
        })

        (result['status']).should.equal('success')
        (result['data']['staff']).should.equal(true)
    end

    it 'should work with remember token' do
        request('/user/logout', {})
        result = request('/user/login', {
            email: @loginEmail,
            password: @loginPass,
            remember: 1
        })

        (result['status']).should.equal('success')

        @rememberToken = result['data']['rememberToken']
        @userId = result['data']['userId']

        request('/user/logout', {})
        result = request('/user/login', {
            userId: @userId,
            rememberToken: '12abc',
            remember: 1
        })
        (result['status']).should.equal('fail')
        result = request('/user/login', {
            userId: 1,
            rememberToken: @rememberToken,
            remember: 1
        })
        (result['status']).should.equal('fail')

        result = request('/user/login', {
            userId: @userId,
            rememberToken: @rememberToken,
            remember: 1
        })
        (result['status']).should.equal('success')
    end
end
