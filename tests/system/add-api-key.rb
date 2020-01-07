describe'system/add-api-key' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should add API key' do
        result= request('/system/add-api-key', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'new API',
            type: 'REGISTRATION'
        })

        (result['status']).should.equal('success')

        row = $database.getRow('apikey', 1, 'id')

        (row['name']).should.equal('new API')
        (result['data']).should.equal(row['token'])
    end

    it 'should not add API key if name already used' do
        result= request('/system/add-api-key', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'new API',
            type: 'REGISTRATION'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NAME_ALREADY_USED')
    end

    it 'should not add API key if invalid type is used' do
        result= request('/system/add-api-key', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'new API2',
            type: 'REGISTRATON'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_API_KEY_TYPE')
    end
end
