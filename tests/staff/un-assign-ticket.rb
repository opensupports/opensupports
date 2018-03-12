describe '/staff/un-assign-ticket' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    #TODO: Create a staff without the ticket

    #it 'should fail if staff is not assign to the ticket'do

    #end
    it 'should fail if ticket is not yours and you are a staff level 1' do
        $database.query('update staff set level="1" where id="1";')
        ticket = $database.getRow('ticket', 1 , 'id')
        result = request('/staff/un-assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
        $database.query('update staff set level="3" where id="1";')
    end

    it 'should unassign ticket if it is the current owner' do
        ticket = $database.getRow('ticket', 1 , 'id')
        result = request('/staff/un-assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 1 , 'id')

        (ticket['owner_id']).should.equal(nil)
        (ticket['unread']).should.equal('1')

        staff_ticket = $database.getRow('staff_ticket', 1 , 'id')

        (staff_ticket).should.equal(nil)
    end

    it 'should unassign ticket if you are a staff level 3' do
      Scripts.createStaff('staff_level_1', 'password', 'maxi')
      Scripts.logout()
      Scripts.login('staff_level_1',)
      ticket = $database.getRow('ticket', 1 , 'id')
      request('/staff/assign-ticket', {
          ticketNumber: ticket['ticket_number'],
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token
      })
      Scripts.logout()
      Scripts.login($staff[:email], $staff[:password], true)
      result = request('/staff/un-assign-ticket', {
          ticketNumber: ticket['ticket_number'],
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token
      })

      (result['status']).should.equal('success')

      ticket = $database.getRow('ticket', 1 , 'id')

      (ticket['owner_id']).should.equal(nil)
      (ticket['unread']).should.equal('1')

      staff_ticket = $database.getRow('staff_ticket', 1 , 'id')

      (staff_ticket).should.equal(nil)
    end

end
