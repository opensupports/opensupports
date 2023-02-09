describe'system/delete-api-key' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should not delete API key' do
            result= request('/system/delete-api-key', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: 'new PIA'
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_NAME')
        end

        it 'should delete API key' do
            result= request('/system/delete-api-key', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: 'new API'
            })

            (result['status']).should.equal('success')

            row = $database.getRow('apikey', 2, 'id')

            (row).should.equal(nil)
        end

end
