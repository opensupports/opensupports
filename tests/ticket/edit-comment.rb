describe '/ticket/edit-comment' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)
    Scripts.createTicket('ticket made by a staff','content of the ticket made by a staff')

    Scripts.logout()
    Scripts.login()
    Scripts.createTicket('ticket made by a user','content of the ticket made by a user')

    def getTicketEventsCommentsQuery(ticketId)
        return "SELECT * FROM `ticketevent` WHERE `type` = 'COMMENT' AND `ticket_id` = #{ticketId} ORDER BY `ticketevent`.`id` ASC;"
    end

    ticket = $database.getRow('ticket', 'ticket made by a user', 'title')
    ticket2 = $database.getRow('ticket', 'ticket made by a staff', 'title')

    it 'should success if author is right and ticket has no comment' do
        result = request('/ticket/edit-comment', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            content: 'content edited by the user',
            ticketNumber: ticket['ticket_number']
        })

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket['id']))
        tickets_comments.size.should.equal(0)
        ticket = $database.getRow('ticket', 'ticket made by a user', 'title')

        (result['status']).should.equal('success')
        (ticket['content']).should.equal('content edited by the user')
    end

    it 'should success if author is right and its the last comment' do
        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket['id']))
        tickets_comments.size.should.equal(0)

        Scripts.commentTicket(ticket['ticket_number'],'com    ment of a user')
        ticketevent = $database.getRow('ticketevent', 'com    ment of a user', 'content')

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket['id']))
        tickets_comments.size.should.equal(1)
        tickets_comments.to_a.last['content'].should.equal('com    ment of a user')

        result = request('/ticket/edit-comment', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            content: 'comment edited by the user',
            ticketEventId: ticketevent['id']
        })

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket['id']))
        tickets_comments.size.should.equal(1)

        (result['status']).should.equal('success')

        tickets_comments.to_a.last['content'].should.equal('comment edited by the user')

        Scripts.commentTicket(ticket['ticket_number'],'com    ment of a user 2')
        ticketevent = $database.getRow('ticketevent', 'com    ment of a user 2', 'content')

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket['id']))
        tickets_comments.size.should.equal(2)
        tickets_comments.to_a.last['content'].should.equal('com    ment of a user 2')

        result = request('/ticket/edit-comment', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            content: 'comment edited by the user 2',
            ticketEventId: ticketevent['id']
        })

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket['id']))
        tickets_comments.size.should.equal(2)
        tickets_comments.to_a.last['content'].should.equal('comment edited by the user 2')

        (result['status']).should.equal('success')

        Scripts.commentTicket(ticket['ticket_number'],'com    ment of a user 3')
        ticketevent = $database.getRow('ticketevent', 'com    ment of a user 3', 'content')

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket['id']))
        tickets_comments.size.should.equal(3)
        tickets_comments.to_a.last['content'].should.equal('com    ment of a user 3')

        result = request('/ticket/edit-comment', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            content: 'comment edited by the user 3',
            ticketEventId: ticketevent['id']
        })

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket['id']))
        tickets_comments.size.should.equal(3)
        tickets_comments.to_a.last['content'].should.equal('comment edited by the user 3')

        ticketevent = tickets_comments.to_a.last

        (result['status']).should.equal('success')

        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        Scripts.commentTicket(ticket['ticket_number'],'com    ment of a staff xd')
        ticketevent = $database.getRow('ticketevent', 'com    ment of a staff xd', 'content')

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket['id']))
        tickets_comments.size.should.equal(4)
        tickets_comments.to_a.last['content'].should.equal('com    ment of a staff xd')

        result = request('/ticket/edit-comment', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            content: 'comment edited by the staff xd',
            ticketEventId: ticketevent['id']
        })

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket['id']))
        tickets_comments.size.should.equal(4)
        tickets_comments.to_a.last['content'].should.equal('comment edited by the staff xd')

        ticketevent = tickets_comments.to_a.last

        (result['status']).should.equal('success')

        Scripts.logout()
        Scripts.login()
    end

    it 'should fail if author is right but ticket has other commets below' do
        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket['id']))
        tickets_comments.size.should.equal(4)

        result = request('/ticket/edit-comment', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            content: 'content edited by the user',
            ticketNumber: ticket['ticket_number']
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('TICKET_CONTENT_CANNOT_BE_EDITED')

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket['id']))
        tickets_comments.size.should.equal(4)

        Scripts.commentTicket(ticket['ticket_number'],'com    ment of a user 4')

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket['id']))
        tickets_comments.size.should.equal(5)
        ticket_comment3 = tickets_comments.to_a.last

        Scripts.commentTicket(ticket['ticket_number'],'com    ment of a user 5')

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket['id']))
        tickets_comments.size.should.equal(6)

        result = request('/ticket/edit-comment', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            content: 'this is not the last comment of the ticket',
            ticketEventId: ticket_comment3['id']
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_TICKET_EVENT')
    end

    it 'should fail if ticket has no comments but author is wrong' do
        result = request('/ticket/edit-comment', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            content: 'this is not my ticket',
            ticketNumber: ticket2['ticket_number']
        })

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket2['id']))
        tickets_comments.size.should.equal(0)
        ticket2 = $database.getRow('ticket', 'ticket made by a staff', 'title')

        (result['status']).should.equal('fail')
        (ticket2['content']).should.equal('content of the ticket made by a staff')
        (result['message']).should.equal('NO_PERMISSION')
    end

    it 'should fail if ticket has comment  and author is wrong' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket2['id']))
        tickets_comments.size.should.equal(0)

        Scripts.commentTicket(ticket2['ticket_number'],'com    ment of a staff')

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket2['id']))
        tickets_comments.size.should.equal(1)
        tickets_comments.to_a.last['content'].should.equal('com    ment of a staff')

        Scripts.logout()
        Scripts.login()

        result = request('/ticket/edit-comment', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            content: 'this is not my ticket',
            ticketNumber: ticket2['ticket_number']
        })

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket2['id']))
        tickets_comments.size.should.equal(1)
        ticket2 = $database.getRow('ticket', 'ticket made by a staff', 'title')

        (result['status']).should.equal('fail')
        (ticket2['content']).should.equal('content of the ticket made by a staff')
        (result['message']).should.equal('NO_PERMISSION')
    end


    it 'should fail if author is wrong but comment is the last' do
        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket2['id']))
        tickets_comments.size.should.equal(1)

        ticket_comment = tickets_comments.to_a.last

        ticket_comment['content'].should.equal('com    ment of a staff')

        result = request('/ticket/edit-comment', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            content: 'this comment it is not mine',
            ticketEventId: ticket_comment['id']
        })

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket2['id']))
        tickets_comments.size.should.equal(1)

        ticket_comment = tickets_comments.to_a.last

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
        ticket_comment['content'].should.equal('com    ment of a staff')
    end

    it 'should fail if the author and comment are wrong' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket2['id']))
        tickets_comments.size.should.equal(1)
        first_comment = tickets_comments.to_a.last

        Scripts.commentTicket(ticket2['ticket_number'],'com    ment of a staff 2')

        tickets_comments = $database.query(getTicketEventsCommentsQuery(ticket2['id']))
        tickets_comments.size.should.equal(2)
        last_comment = tickets_comments.to_a.last
        last_comment['content'].should.equal('com    ment of a staff 2')

        Scripts.logout()
        Scripts.login()

        result = request('/ticket/edit-comment', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            content: 'this comment it is not mine and is not the last',
            ticketEventId: first_comment['id']
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
        last_comment['content'].should.equal('com    ment of a staff 2')
    end
end
