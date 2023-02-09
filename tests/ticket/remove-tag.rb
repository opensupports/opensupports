describe '/ticket/remove-tag' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    result = $database.getRow('ticket', 'test ticket' , 'title')
    tag = $database.getRow('tag', 'test tag', 'name')

    @ticketNumber = result['ticketNumber']

    it 'should fail if the ticket number is invalid'do
        result = request('/ticket/remove-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: tag['id'],
            ticketNumber: 0
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_TICKET')
    end

    it 'should fail is the tag id is not valid'do
        result = request('/ticket/remove-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 100,
            ticketNumber: @ticketNumber
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_TAG')
    end

    it 'should remove an attached tag if staff member serves to the department of the ticket' do
        result = request('/ticket/remove-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: tag['id'],
            ticketNumber: @ticketNumber
        })

        (result['status']).should.equal('success')

    end
    it 'should remove an attached tag if staff member does not serve to department ticket but is author' do
        Scripts.createTicket('title44','contentoftheticket44',3)
        ticket = $database.getRow('ticket','title44', 'title')

        request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 1,
            ticketNumber: ticket['ticket_number']
        })

        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1, 2]',
            staffId: 1
        })

        result = request('/ticket/remove-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 1,
            ticketNumber: ticket['ticket_number']
        })

        (result['status']).should.equal('success')

        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1, 2, 3]',
            staffId: 1
        })
    end
    it 'should fail if staff does not serve to department of the ticket and is not the author' do
        Scripts.logout()
        Scripts.login('pepito@pepito.com', 'pepito12345')
        Scripts.createTicket('title73','contentoftheticket73',3)
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        ticket = $database.getRow('ticket','title73', 'title')

        request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 1,
            ticketNumber: ticket['ticket_number']
        })

        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1, 2]',
            staffId: 1
        })

        result = request('/ticket/remove-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 1,
            ticketNumber: ticket['ticket_number']
        })

        (result['status']).should.equal('fail')

        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1, 2, 3]',
            staffId: 1
        })
    end

    it 'should fail if the tag is not attached' do
        result = request('/ticket/remove-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: tag['id'],
            ticketNumber: @ticketNumber
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_TAG')
    end
end
