describe '/ticket/edit-comment' do

    request('/user/logout')
    Scripts.login();
    Scripts.createTicket('ticket made by an user','content of the ticket made by an user')
    ticket = $database.getRow('ticket', 'ticket made by an user', 'title')
    Scripts.commentTicket(ticket['ticket_number'],'com    ment of a user')

    it 'should change content of the ticket if the author user tries it' do
        result = request('/ticket/edit-comment', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            content: 'content edited by the user',
            ticketNumber: ticket['ticket_number']
        })

        ticket = $database.getRow('ticket', 'ticket made by an user', 'title')

        (result['status']).should.equal('success')
        (ticket['content']).should.equal('content edited by the user')
    end

    it 'should change the content of a comment if the user is the author' do

        ticketevent = $database.getRow('ticketevent', 'com    ment of a user', 'content')

        result = request('/ticket/edit-comment', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            content: 'comment edited by the user',
            ticketEventId: ticketevent['id']
        })

        ticketevent = $database.getRow('ticketevent', 'comment edited by the user', 'content')

         (result['status']).should.equal('success')
         (ticketevent['content']).should.equal('comment edited by the user')
    end

    it 'should change the content of a comment and the content of the ticket if the admin is logged' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)
        ticketevent = $database.getRow('ticketevent', 'comment edited by the user', 'content')

        result = request('/ticket/edit-comment', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            content: 'comment edited by a staff',
            ticketEventId: ticketevent['id']
        })

        ticketevent = $database.getRow('ticketevent', 'comment edited by a staff', 'content')

        (result['status']).should.equal('success')
        (ticketevent['content']).should.equal('comment edited by a staff')

        result = request('/ticket/edit-comment', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            content: 'content edited by a staff',
            ticketNumber: ticket['ticket_number']
        })

        ticket = $database.getRow('ticket', ticket['ticket_number'], 'ticket_number')

        (result['status']).should.equal('success')
        (ticket['content']).should.equal('content edited by a staff')

        request('/user/logout')
    end


    it 'should not change the content of a comment if the user is not the author' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)

        ticket = $database.getRow('ticket', 'ticket made by an user', 'title')

        Scripts.assignTicket(ticket['ticket_number'])
        Scripts.commentTicket(ticket['ticket_number'],'this is a new comment of a staff member')

        ticketevent = $database.getRow('ticketevent', 'this is a new comment of a staff member', 'content')

        request('/user/logout')
        Scripts.login();

        result = request('/ticket/edit-comment', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            content: 'comment edited by an user',
            ticketEventId: ticketevent['id']
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
    end

end
