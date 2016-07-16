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

#    it 'should login correctly' do

#    end

#    it 'should fail if already logged in' do

#    end

    it 'should return remember token' do
        request('/user/logout', {})
        result = request('/user/login', {
            email: @loginEmail,
            password: @loginPass,
            remember: true
        })

        (result['status']).should.equal('success')

        @rememberToken = result['data']['rememberToken']# falta comproversion
        @userid = result['data']['userId']
    end

    it 'should login with token' do
        request('/user/logout', {})
        result = request('/user/login', {
            rememberToken: @rememberToken,
            userId: @userid
        })

        (result['status']).should.equal('success')
        (result['data']['userId']).should.equal(@userid)
    end
end
