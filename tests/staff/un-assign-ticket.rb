describe '/staff/un-assign-ticket' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    #TODO: Create a staff without the ticket

    #it 'should fail if staff is not assign to the ticket'do

    #end

    it 'should un assign ticket if everything is okey' do
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

    it 'should fail if ticket is not  yours' do
        ticket = $database.getRow('ticket', 1 , 'id')
        result = request('/staff/un-assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
    end
end