describe '/ticket/add-tag' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    Scripts.createTag('test tag', 'orange')
    result = Scripts.createTicket('test ticket')

    @ticketNumber = result['ticketNumber']

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

    it 'should add a tag' do
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
end
