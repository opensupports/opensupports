describe '/ticket/close' do

    it 'should close ticket if staff member has the same department as ticket' do
        Scripts.logout()
        Scripts.createUser('closer@os4.com','closer','Closer')
        Scripts.login('closer@os4.com','closer')
        Scripts.createTicket('tickettoclose','thecontentoftickettoclose',1)
        Scripts.createTicket('tickettoclose2','thecontentoftickettoclose2',3)
        Scripts.createTicket('tickettoclose3','thecontentoftickettoclose3',3)

        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        ticket = $database.getRow('ticket', 'tickettoclose', 'title')

        result = request('/ticket/close', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token

        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'tickettoclose', 'title')
        (ticket['closed']).should.equal(1)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('CLOSE')
    end
    it 'should close ticket if staff member does not serve to the department of the ticket but he is the author' do

      request('/staff/edit', {
        csrf_userid: $csrf_userid,
        csrf_token: $csrf_token,
        departments: '[1, 2]',
        staffId: 1
      })
      Scripts.createTicket('thisisanewticket','thisisthecontentofthenewticket',3)

      ticket = $database.getRow('ticket', 'thisisanewticket', 'title')

      result = request('/ticket/close', {
          ticketNumber: ticket['ticket_number'],
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token

      })

      (result['status']).should.equal('success')

      ticket = $database.getRow('ticket', 'tickettoclose', 'title')
      (ticket['closed']).should.equal(1)

      lastLog = $database.getLastRow('log')
      (lastLog['type']).should.equal('CLOSE')

    end
    it 'should not close ticket if staff does not serve to the department of the ticket and  he is not the author'do

        ticket = $database.getRow('ticket', 'tickettoclose2', 'title')

        result = request('/ticket/close', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token

        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')

        ticket = $database.getRow('ticket', 'tickettoclose2', 'title')
        (ticket['closed']).should.equal(0)

        request('/staff/edit', {
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token,
          departments: '[1, 2, 3]',
          staffId: 1
        })
    end
    it 'should close ticket if User is the author' do
        Scripts.logout()
        Scripts.login('closer@os4.com','closer')

        ticket = $database.getRow('ticket', 'tickettoclose3', 'title')

        result = request('/ticket/close', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'tickettoclose3', 'title')
        (ticket['closed']).should.equal(1)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('CLOSE')

        Scripts.logout()
    end
end
