describe '/staff/last-events' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should get last events' do

        result = request('/staff/last-events', {
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        (result['data'].size).should.equal(10)
    end
end
