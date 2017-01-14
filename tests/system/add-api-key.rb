describe'system/add-api-key' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should add API key' do
            result= request('/system/add-api-key', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: 'new API'
            })

            (result['status']).should.equal('success')

            row = $database.getRow('apikey', 1, 'id')

            (row['name']).should.equal('new API')
            (result['data']).should.equal(row['token'])

        end
        it 'should not add API key' do
            result= request('/system/add-api-key', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: 'new API'
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('NAME_ALREADY_USED')
        end
end
