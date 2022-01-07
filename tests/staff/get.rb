describe '/staff/get/' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should return staff member data' do
        result = request('/staff/get', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        (result['data']['name']).should.equal('Emilia Clarke')
        (result['data']['staff']).should.equal(true)
        (result['data']['email']).should.equal($staff[:email])
        (result['data']['level']).should.equal('3')
        (result['data']['sendEmailOnNewTicket']).should.equal('1')
    end
    it 'should return staff member data with staff Id' do
        staff = $database.getRow('staff','tyrion@opensupports.com','email')
        result = request('/staff/get', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            staffId: staff['id']
        })

        (result['status']).should.equal('success')
        (result['data']['name']).should.equal('Tyrion Lannister')
        (result['data']['staff']).should.equal(true)
        (result['data']['email']).should.equal('tyrion@opensupports.com')
        (result['data']['level']).should.equal('2')
        (result['data']['sendEmailOnNewTicket']).should.equal('0')
    end
end
