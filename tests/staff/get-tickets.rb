describe '/staff/get-tickets' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should get ticket list' do

        ticket = $database.getRow('ticket', 1 , 'id')
        request('/staff/assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        ticket = $database.getRow('ticket', 2 , 'id')
        request('/staff/assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        result = request('/staff/get-tickets', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        (result['data'].size).should.equal(5)
    end
end
