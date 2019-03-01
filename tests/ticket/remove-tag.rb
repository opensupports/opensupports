describe '/ticket/remove-tag' do
    request('/user/logout')
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

    it 'should remove an attached tag' do
        result = request('/ticket/remove-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: tag['id'],
            ticketNumber: @ticketNumber
        })

        (result['status']).should.equal('success')

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
