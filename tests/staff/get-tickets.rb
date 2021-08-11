describe '/staff/get-tickets' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should get ticket list' do

        ticket = $database.getRow('ticket', 1 , 'id')
        request('/staff/assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        ticket = $database.getRow('ticket', 2 , 'id')
        request('/staff/assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        result = request('/staff/get-tickets', {
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        (result['data']['tickets'].size).should.equal(10)
    end
end
