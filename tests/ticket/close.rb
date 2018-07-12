describe '/ticket/close' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

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

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('CLOSE')

        request('/user/logout')
        Scripts.createUser('closer@os4.com','closer','Closer')
        Scripts.login('closer@os4.com','closer')
        Scripts.createTicket('tickettoclose')

        ticket = $database.getRow('ticket', 'tickettoclose', 'title')

        result = request('/ticket/close', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token

        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'tickettoclose', 'title')
        (ticket['closed']).should.equal('1')
        (ticket['unread']).should.equal('1')

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('CLOSE')

    end
end
