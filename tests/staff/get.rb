describe '/staff/get/' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should return staff member data' do
        result = request('/staff/get', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        (result['data']['name']).should.equal('Emilia Clarke')
        (result['data']['staff']).should.equal(true)
    end
end