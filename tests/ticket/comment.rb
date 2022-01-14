describe '/ticket/comment/' do
    Scripts.createUser('commenter@os4.com', 'commenter', 'Commenter')
    Scripts.login('commenter@os4.com', 'commenter')

    Scripts.createTicket('Winter came and it was a disappointment','The fandom remembers')
    ticket = $database.getRow('ticket', 'Winter came and it was a disappointment' , 'title')
    @ticketNumber = ticket['ticket_number']

    it 'should fail if invalid token is passed' do
        result = request('/ticket/comment', {
            content: 'some comment content',
            ticketId: @ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: 'INVALID_TOKEN'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
    end

    it 'should fail if ticket does not exist' do
        result = request('/ticket/comment', {
            content: 'some comment content',
            ticketNumber: 30,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_TICKET')
    end

    it 'should add comment to ticket' do
        result = request('/ticket/comment', {
            content: 'some comment content',
            ticketNumber: @ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', @ticketNumber, 'ticket_number')
        comment = $database.getRow('ticketevent', ticket['id'], 'ticket_id')
        (comment['content']).should.equal('some comment content')
        (comment['type']).should.equal('COMMENT')
        (comment['author_user_id']).should.equal($csrf_userid.to_i)
        (ticket['unread_staff']).should.equal(1)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('COMMENT')
    end

    it 'should add comment if staff member serves to the same department as the ticket' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        result = request('/ticket/comment', {
            content: 'some comment content',
            ticketNumber: $ticketNumberByStaff,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', $ticketNumberByStaff, 'ticket_number')
        comment = $database.getRow('ticketevent', ticket['id'], 'ticket_id')
        (comment['content']).should.equal('some comment content')
        (comment['type']).should.equal('COMMENT')
        (comment['author_staff_id']).should.equal($csrf_userid.to_i)
        (ticket['unread_staff']).should.equal(1)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('COMMENT')

        Scripts.logout()
    end
    it 'should comment the ticket if staff member does not serve the deparment of the ticket and he is author' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        Scripts.createTicket('ticketttobecommented', 'tickettobecommentedbytheauthor', 2)
        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1]',
            staffId: 1
        })
        ticket = $database.getRow('ticket', 'ticketttobecommented' , 'title')

        result = request('/ticket/comment', {
            content: 'some comment content jeje',
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'ticketttobecommented' , 'title')
        comment = $database.getRow('ticketevent', ticket['id'], 'ticket_id')
        (comment['content']).should.equal('some comment content jeje')
        (comment['type']).should.equal('COMMENT')
        (comment['author_staff_id']).should.equal($csrf_userid.to_i)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('COMMENT')

    end
    it 'should not comment the ticket if staff member does not serve to the department of the ticket and he is not the author' do
        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[]',
            staffId: 1
        })

        Scripts.logout()
        Scripts.login('commenter@os4.com', 'commenter')
        Scripts.createTicket('title138','commentofthetitkect138', 1)
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        ticket = $database.getRow('ticket', 'title138' , 'title')

        result = request('/ticket/comment', {
            content: 'some comment content jeje',
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')

        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1, 2]',
            staffId: 1
        })
    end

    it 'should fail if user is not the author nor owner' do
        Scripts.createUser('no_commenter@comment.com', 'no_commenter', 'No Commenter')
        Scripts.login('no_commenter@comment.com', 'no_commenter')

        result = request('/ticket/comment', {
            content: 'some comment content',
            ticketNumber: @ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')

        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        result = request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Jorah mormont',
            email: 'jorah@opensupports.com',
            level: 2,
            profilePic: '',
            departments: '[1]'
        })

        (result['status'].should.equal('success'))

        Scripts.logout()

        recoverpassword = $database.getRow('recoverpassword', 'jorah@opensupports.com', 'email')
        request('/user/recover-password', {
            email: 'jorah@opensupports.com',
            password: 'testpassword',
            token: recoverpassword['token']
        })

        Scripts.login('jorah@opensupports.com', 'testpassword', true)
        result = request('/ticket/comment', {
            content: 'some comment content',
            ticketNumber: @ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
    end

    it 'should keep private on 0 if an user creates a private comment' do
        Scripts.login('commenter@os4.com', 'commenter')

        result = request('/ticket/comment', {
            content: 'this is not a private comment',
            ticketNumber: @ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            private: 1
        })

        (result['status']).should.equal('success')
        comment = $database.getRow('ticketevent', 'this is not a private comment', 'content')
        (comment['private']).should.equal(0)
        Scripts.logout()

    end

    it 'should change private to 1 if a staff creates a private comment' do
        Scripts.logout()

        Scripts.login('jorah@opensupports.com', 'testpassword', true)

        request('/staff/assign-ticket', {
            ticketNumber: @ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
        })

        result = request('/ticket/comment', {
            content: 'this is a private comment',
            ticketNumber: @ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            private: 1
        })

        (result['status']).should.equal('success')
        comment = $database.getRow('ticketevent', 'this is a private comment', 'content')
        (comment['private']).should.equal(1)
    end
end
