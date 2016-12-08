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
        (result['data']['email']).should.equal('staff@opensupports.com')
        (result['data']['level']).should.equal('3')
    end
    it 'should return staff member data with staff Id' do
        result = request('/staff/get', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            staffId:2
        })

        (result['status']).should.equal('success')
        (result['data']['name']).should.equal('Tyrion Lannister')
        (result['data']['staff']).should.equal(true)
        (result['data']['email']).should.equal('tyrion@opensupports.com')
        (result['data']['level']).should.equal('2')
    end
end