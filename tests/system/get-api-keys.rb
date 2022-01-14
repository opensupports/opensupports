describe'system/get-api-keys' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should get all API keys' do
        
        result = request('/system/get-api-keys', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
        })

        (result['status']).should.equal('success')
        (result['data'][0]['name']).should.equal('APIkeyToTicketget')
        (result['data'][1]['name']).should.equal('APIkey ticketnumber return')
        (result['data'][2]['name']).should.equal('APIkey check tickets')
        (result['data'][3]['name']).should.equal('APIkey user create')
        (result['data'][4]['name']).should.equal('APIkey  create tickets')
        
    end
end
