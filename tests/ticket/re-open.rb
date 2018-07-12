describe '/ticket/re-open' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should re open  a ticket if everything is okey' do
        ticket = $database.getRow('ticket', 1 , 'id')

        result = request('/ticket/re-open', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 1 , 'id')
        (ticket['closed']).should.equal('0')
        (ticket['unread']).should.equal('1')

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('RE_OPEN')

        request('/user/logout')
        Scripts.createUser('reopener@os4.com','reopener','Reopener')
        Scripts.login('reopener@os4.com','reopener')
        Scripts.createTicket('tickettoreopen')

        ticket = $database.getRow('ticket', 'tickettoreopen', 'title')

        Scripts.closeTicket(ticket['ticketNumber'])

        result = request('/ticket/re-open', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        
        ticket = $database.getRow('ticket', 'tickettoreopen', 'title')
        (ticket['closed']).should.equal('0')
        (ticket['unread']).should.equal('1')

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('RE_OPEN')
    end
end
