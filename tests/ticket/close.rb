describe '/ticket/close' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    #TODO: DO THINGS

    it 'should close a ticket if everything is okey' do
        ticket = $database.getRow('ticket', 1 , 'id')

        result = request('/ticket/close', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 1 , 'id')
        (ticket['closed']).should.equal('1')
        (ticket['unread']).should.equal('1')

    end
end