describe'/system/disable-registration' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)
    api_key = Scripts.createAPIKey('registrationKey', canCreateUsers = 1)['data']

    it 'should not disable registration if password is not correct' do
        result= request('/system/disable-registration', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            password: 'hello'
        })

        (result['status']).should.equal('fail')

        row = $database.getRow('setting', 'registration', 'name')

        (row['value']).should.equal('1')
    end

    it 'should disable registration' do
        result = request('/system/disable-registration', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            password: $staff[:password]
        })

        (result['status']).should.equal('success')

        row = $database.getRow('setting', 'registration', 'name')

        (row['value']).should.equal('0')
    end

    it 'should not create user in database if registration is false' do
        result = request('/user/signup', {
          :name => 'ponzio',
          :email => 'jc@ponziolandia.com',
          :password => 'tequila'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
    end

    it 'should create user if using api key' do
        result = request('/user/signup', {
          :name => 'ponzio',
          :email => 'jc@ponziolandia.com',
          :password => 'tequila',
          :apiKey => api_key
        })
        (result['status']).should.equal('success')
    end
end
