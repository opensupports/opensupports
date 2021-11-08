describe '/ticket/re-open' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should re open  a ticket if staff member has the deparment of the ticket' do
        ticket = $database.getRow('ticket', 'Should we pay?' , 'title')

        result = request('/ticket/re-open', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'Should we pay?' , 'title')
        (ticket['closed']).should.equal(0)
        (ticket['unread']).should.equal(1)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('RE_OPEN')

        Scripts.logout()
    end
    it 'Should re-open if staff member does not serve to the department of the ticket and its the author'do
        Scripts.login($staff[:email], $staff[:password], true)
        Scripts.createTicket('tickettitle','contentoftheticketthatisgoingtosucces',3)

        ticket = $database.getRow('ticket', 'contentoftheticketthatisgoingtosucces' , 'content')

        Scripts.closeTicket(ticket['ticketNumber'])

        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1, 2]',
            staffId: 1
        })

        result = request('/ticket/re-open', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'contentoftheticketthatisgoingtosucces' , 'content')
        (ticket['closed']).should.equal(0)

        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1, 2, 3]',
            staffId: 1
        })
    end

    it 'Should re-open ticket if the user is author' do
        Scripts.createUser('reopener@os4.com','reopener','Reopener')
        Scripts.login('reopener@os4.com','reopener')
        Scripts.createTicket('tickettoreopen')
        Scripts.createTicket('tickettuser','this ticket was made by an user',3)

        ticket = $database.getRow('ticket', 'this ticket was made by an user', 'content')
        Scripts.closeTicket(ticket['ticketNumber'])

        ticket = $database.getRow('ticket', 'tickettoreopen', 'title')
        Scripts.closeTicket(ticket['ticketNumber'])

        result = request('/ticket/re-open', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'tickettoreopen', 'title')
        (ticket['closed']).should.equal(0)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('RE_OPEN')

        Scripts.logout()
    end

    it 'Should fail re-open the ticket if the staff does not serve to the department and he is not the author' do

        Scripts.login($staff[:email], $staff[:password], true)
        ticket = $database.getRow('ticket', 'this ticket was made by an user' , 'content')

        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1, 2]',
            staffId: 1
        })

        result = request('/ticket/re-open', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')

        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1, 2, 3]',
            staffId: 1
        })
    end
end
