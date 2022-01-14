describe '/staff/get-tickets' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should get ticket list' do

        ticket = $database.getRow('ticket', 'Should we pay?', 'title')
        request('/staff/assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        ticket = $database.getRow('ticket', 'Test', 'content')
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
