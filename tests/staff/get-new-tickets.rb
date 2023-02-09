describe '/staff/get-new-tickets' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should get new tickets' do
        result = request('/staff/get-new-tickets', {
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        (result['data']['tickets'].size).should.equal(10)
    end
end
