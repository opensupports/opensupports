describe'system/get-api-keys' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should get all API keys' do
        Scripts.createAPIKey('namekey1', 'REGISTRATION')
        Scripts.createAPIKey('namekey2', 'REGISTRATION')
        Scripts.createAPIKey('namekey3', 'REGISTRATION')
        Scripts.createAPIKey('namekey4', 'REGISTRATION')
        Scripts.createAPIKey('namekey5', 'REGISTRATION')
        
        result = request('/system/get-api-keys', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
        })

        (result['status']).should.equal('success')
        (result['data'][0]['name']).should.equal('namekey1')
        (result['data'][1]['name']).should.equal('namekey2')
        (result['data'][2]['name']).should.equal('namekey3')
        (result['data'][3]['name']).should.equal('namekey4')
        (result['data'][4]['name']).should.equal('namekey5')

    end
end
