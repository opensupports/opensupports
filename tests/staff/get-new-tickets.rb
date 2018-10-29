describe '/staff/get-new-tickets' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should get news tickets' do
        result = request('/staff/get-new-tickets', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        (result['data'].size).should.equal(9)
    end
end
