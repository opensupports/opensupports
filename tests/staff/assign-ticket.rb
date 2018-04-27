describe '/staff/assign-ticket' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    #TODO: Create a staff without all department

    #it 'should fail if staff is not in the same department'do

    #end

    it 'should assign ticket if everything is okey' do
        ticket = $database.getRow('ticket', 1 , 'id')
        result = request('/staff/assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 1 , 'id')

        (ticket['owner_id']).should.equal('1')

        (ticket['unread']).should.equal('1')

        staff_ticket = $database.getRow('staff_ticket', 1 , 'ticket_id')

        (staff_ticket['staff_id']).should.equal('1')

        (staff_ticket['ticket_id']).should.equal('1')
    end

    it 'should fail if ticket is already owned' do
        ticket = $database.getRow('ticket', 1 , 'id')

        result = request('/staff/assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('TICKET_ALREADY_ASSIGNED')
    end

end
