describe '/staff/assign-ticket' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    Scripts.createTicket('ticket_to_assing_1')
    Scripts.createTicket('ticket_to_assing_2')
    Scripts.createTicket('ticket_to_assing_3')
    Scripts.createTicket('ticket_to_assing_4')
    Scripts.createTicket('ticket_to_assing_5')
    Scripts.createTicket('ticket_to_assing_6')
    Scripts.createTicket('ticket_to_assing_7')
    Scripts.createTicket('ticket_to_assing_8')
    Scripts.createTicket('ticket_to_assing_9')
    Scripts.createTicket('ticket_to_assing_10')
    Scripts.createTicket('ticket_to_assing_11')
    Scripts.createTicket('ticket_to_assing_12')
    Scripts.createTicket('ticket_to_assing_13')
    Scripts.createTicket('ticket_to_assing_14')
    Scripts.createTicket('ticket_to_assing_15')
    Scripts.createTicket('ticket_to_assing_16')
    Scripts.createTicket('ticket_to_assing_17')
    Scripts.createTicket('ticket_to_assing_18')

    #TODO: Create a staff without all department

    #it 'should fail if staff is not in the same department'do

    #end

    it 'should assign ticket if everything is okay' do
        ticket1 = $database.getRow('ticket', 'ticket_to_assing_1', 'title')
        ticket2 = $database.getRow('ticket', 'ticket_to_assing_2', 'title')
        ticket3 = $database.getRow('ticket', 'ticket_to_assing_3', 'title')
        ticket4 = $database.getRow('ticket', 'ticket_to_assing_4', 'title')
        ticket5 = $database.getRow('ticket', 'ticket_to_assing_5', 'title')
        ticket6 = $database.getRow('ticket', 'ticket_to_assing_6', 'title')
        ticket7 = $database.getRow('ticket', 'ticket_to_assing_7', 'title')
        ticket8 = $database.getRow('ticket', 'ticket_to_assing_8', 'title')
        ticket9 = $database.getRow('ticket', 'ticket_to_assing_9', 'title')
        ticket10 = $database.getRow('ticket', 'ticket_to_assing_10', 'title')
        ticket11 = $database.getRow('ticket', 'ticket_to_assing_11', 'title')
        ticket12 = $database.getRow('ticket', 'ticket_to_assing_12', 'title')
        ticket13 = $database.getRow('ticket', 'ticket_to_assing_13', 'title')
        ticket14 = $database.getRow('ticket', 'ticket_to_assing_14', 'title')
        ticket15 = $database.getRow('ticket', 'ticket_to_assing_15', 'title')
        ticket16 = $database.getRow('ticket', 'ticket_to_assing_16', 'title')
        ticket17 = $database.getRow('ticket', 'ticket_to_assing_17', 'title')
        ticket18 = $database.getRow('ticket', 'ticket_to_assing_18', 'title')
        ticket_with_id_1 = $database.getRow('ticket', 'Should we pay?', 'title')

        tickets = [
            ticket1,
            ticket2,
            ticket3,
            ticket4,
            ticket5,
            ticket6,
            ticket7,
            ticket8,
            ticket9,
            ticket10,
            ticket11,
            ticket12,
            ticket13,
            ticket14,
            ticket15,
            ticket16,
            ticket17,
            ticket18,
            ticket_with_id_1
        ]

        for ticket in tickets
            result = request('/staff/assign-ticket', {
                ticketNumber: ticket['ticket_number'],
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            (result['status']).should.equal('success')

            ticket = $database.getRow('ticket', ticket['ticket_number'], 'ticket_number')

            (ticket['owner_id']).should.equal(1)

            staff_ticket = $database.getRow('staff_ticket', ticket['id'].to_i , 'ticket_id')

            (staff_ticket['staff_id']).should.equal(1)
            (staff_ticket['ticket_id']).should.equal(ticket['id'])
        end
    end
    it 'should assign ticket if a staff choose another to assing a ticket ' do
        staffId = $database.getRow('staff','ayra2@opensupports.com','email')['id']

        ticket = $database.getRow('ticket', 'Winter is coming!', 'title')
        result = request('/staff/assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            staffId: staffId,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'Winter is coming!', 'title')

        (ticket['owner_id']).should.equal(staffId)

        (ticket['unread']).should.equal(1)
    end

    it 'should fail if ticket is already owned' do
        ticket = $database.getRow('ticket', 'Should we pay?', 'title')

        result = request('/staff/assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('TICKET_ALREADY_ASSIGNED')
    end

end
