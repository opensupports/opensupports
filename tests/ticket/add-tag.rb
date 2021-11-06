describe '/ticket/add-tag' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    Scripts.createTag('test tag', 'orange')
    Scripts.createTicket('test ticket')
    ticket = $database.getRow('ticket', 'test ticket', 'title')
    @ticketNumber = ticket['ticket_number']

    it 'should fail if the tagId is invalid' do
        result = request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 100,
            ticketNumber: @ticketNumber
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_TAG')

    end

    it 'should fail if the ticketNumber is invalid' do
        result = request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 3,
            ticketNumber: 0
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_TICKET')
    end

    it 'should add a tag if staff member serves to the deparment of the ticket' do
        result = request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 3,
            ticketNumber: @ticketNumber
        })
        tag_ticket = $database.getRow('tag_ticket', 3 , 'id')
        ticket = $database.getRow('ticket', @ticketNumber ,'ticket_number')

        (result['status']).should.equal('success')
    end

    it 'should add tag if staff member does not serve to the department of the ticket but is the author' do
        Scripts.createTicket('titleofthetickettoaddtags','thisisthecontentofthetickettoaddtags',3)

        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1, 2]',
            staffId: 1
        })

        ticket = $database.getRow('ticket', 'thisisthecontentofthetickettoaddtags' , 'content')

        result = request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 3,
            ticketNumber: ticket['ticket_number']
        })
        (result['status']).should.equal('success')

        result = request('/ticket/delete', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            ticketNumber: ticket['ticket_number']
        })
        (result['status']).should.equal('success')
    end

    it 'should fail if staff member does not serve to the department of the ticket and he is not the author' do
        Scripts.logout()
        Scripts.createUser('pepito@pepito.com', 'pepito12345','pepito')
        Scripts.login('pepito@pepito.com', 'pepito12345')
        Scripts.createTicket('title70','contentoftheticket70',3)

        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        ticket = $database.getRow('ticket','title70', 'title')

        result = request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 2,
            ticketNumber: ticket['ticket_number']
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')

        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1, 2, 3]',
            staffId: 1
        })
    end



    it 'should fail if the tag is already attached' do
        result = request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 3,
            ticketNumber: @ticketNumber
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('TAG_EXISTS')
    end

    result = request('/ticket/delete', {
        csrf_userid: $csrf_userid,
        csrf_token: $csrf_token,
        ticketNumber: @ticketNumber
    })
    (result['status']).should.equal('success')
end
