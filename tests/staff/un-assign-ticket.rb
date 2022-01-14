describe '/staff/un-assign-ticket' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    #TODO: Create a staff without the ticket

    #it 'should fail if staff is not assign to the ticket'do

    #end

    it 'should unassign ticket if it is the current owner' do
        ticket = $database.getRow('ticket', 'Should we pay?', 'title')

        result = request('/staff/un-assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'Should we pay?', 'title')

        (ticket['owner_id']).should.equal(nil)
        (ticket['unread']).should.equal(1)

        staff_ticket = $database.getRow('staff_ticket', 1 , 'ticket_id')

        (staff_ticket).should.equal(nil)
    end

    it 'should unassign ticket if you are a staff level 1' do
        $database.query('update staff set level="1" where id="1";')

        ticket = $database.getRow('ticket', 'Should we pay?', 'title')

        Scripts.logout()
        Scripts.login('ayra2@opensupports.com', 'starkpassword', true)

        result = request('/staff/assign-ticket', {
          ticketNumber: ticket['ticket_number'],
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'Should we pay?', 'title')

        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        result = request('/staff/un-assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        $database.query('update staff set level="3" where id="1";')
    end

    it 'should unassign ticket if you are a staff level 2' do
        $database.query('update staff set level="2" where id="1";')

        ticket = $database.getRow('ticket', 'Should we pay?', 'title')

        Scripts.logout()
        Scripts.login('ayra2@opensupports.com', 'starkpassword', true)

        result = request('/staff/assign-ticket', {
          ticketNumber: ticket['ticket_number'],
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'Should we pay?', 'title')

        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        result = request('/staff/un-assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        $database.query('update staff set level="3" where id="1";')
    end

    it 'should unassign ticket if you are a staff level 3' do
      ticket = $database.getRow('ticket', 'Should we pay?' , 'title')

      Scripts.logout()
      Scripts.login($staff[:email], $staff[:password], true)

      result = request('/staff/assign-ticket', {
        ticketNumber: ticket['ticket_number'],
        csrf_userid: $csrf_userid,
        csrf_token: $csrf_token
      })

      (result['status']).should.equal('success')

      ticket = $database.getRow('ticket', 'Should we pay?' , 'title')

      result = request('/staff/un-assign-ticket', {
          ticketNumber: ticket['ticket_number'],
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token
      })

      (result['status']).should.equal('success')

      ticket = $database.getRow('ticket', 'Should we pay?' , 'title')

      (ticket['owner_id']).should.equal(nil)
      (ticket['unread']).should.equal(1)

      staff_ticket = $database.getRow('staff_ticket', 1 , 'ticket_id')

      (staff_ticket).should.equal(nil)
    end

end
