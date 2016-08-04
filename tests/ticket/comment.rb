describe '/ticket/comment/' do
    it 'should fail if invalid token is passed' do
        result = request('/ticket/comment', {
            content: 'some comment content',
            ticketId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: 'INVALID_TOKEN'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('You have no permission to access')
    end

    it 'should fail if content is too short' do
        result = request('/ticket/comment', {
            content: 'Test',
            ticketId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('Invalid content')
    end

    it 'should fail if content is very long' do
        long_text = ''
        600.times {long_text << 'a'}

        result = request('/ticket/comment', {
            content: long_text,
            ticketId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('Invalid content')
    end

    it 'should fail if ticket does not exist' do
        result = request('/ticket/comment', {
            content: 'some comment content',
            ticketId: 30,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('Invalid ticket')
    end

    it 'should add comment to ticket' do
        result = request('/ticket/comment', {
            content: 'some comment content',
            ticketId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        comment = $database.getRow('comment', '1', 'id')
        (comment['content']).should.equal('some comment content')
        (comment['ticket_id']).should.equal('1')
        (comment['author_id']).should.equal('1')
    end

    it 'should fail if user is not the author nor owner' do
        Scripts.createUser('commenter@comment.com', 'commenter', 'Commenter')
        data = Scripts.login('commenter@comment.com', 'commenter')

        result = request('/ticket/comment', {
            content: 'some comment content',
            ticketId: 1,
            csrf_userid: data['userId'],
            csrf_token: data['token']
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('You have no permission to access')
    end

    #it 'should add comment if logged as ticket owner' do

    #end
end