describe '/system/apikey-permissions' do
    request('/user/logout')
   
    Scripts.login($staff[:email], $staff[:password], true)
    
    apikeycanCreateUsersToken = Scripts.createAPIKey('create users',canCreateUsers=1, canCreateTickets=0, canCommentTickets=0,  shouldReturnTicketNumber=0)['data']
    apikeycanCreateTickets = Scripts.createAPIKey('create tickets',canCreateUsers=0, canCreateTickets=1, canCommentTickets=0,  shouldReturnTicketNumber=0)['data']
    apikeycanCommentTickets = Scripts.createAPIKey('comment tickets',canCreateUsers=0, canCreateTickets=0, canCommentTickets=1,  shouldReturnTicketNumber=0)['data']
    apikeycanCreateandReturnTickets = Scripts.createAPIKey('create and return tickets',canCreateUsers=0, canCreateTickets=1, canCommentTickets=0,  shouldReturnTicketNumber=1)['data']
    
    it 'should fail ticket create if the apikey does not have create ticket permission' do
        result = request('/ticket/create', {
            language: 'en',
            title: 'try of title Ticket',
            content: 'try of content Ticket',
            departmentId: 1,
            apiKey: apikeycanCreateUsersToken,   
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_API_KEY_PERMISSION')

        result = request('/ticket/create', {
            language: 'en',
            title: 'try of title Ticket',
            content: 'try of content Ticket',
            departmentId: 1,
            apiKey: apikeycanCommentTickets,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_API_KEY_PERMISSION')
    end

    it 'should create ticket if the apikey has the correct permission' do
        result = request('/ticket/create', {
            language: 'en',
            title: 'ticket created with apikeycanCreateTickets',
            content: 'content of Ticket apikeycanCreateTickets',
            departmentId: 1,
            apikey: apikeycanCreateTickets,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')
        (result['data']).should.equal(nil)

        result = request('/ticket/create', {
            language: 'en',
            title: 'ticket created with apikeycanCreateandReturnTickets',
            content: 'content of Ticket apikeycanCreateandReturnTickets',
            departmentId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            apiKey: apikeycanCreateandReturnTickets   
        })
        ticket = $database.getRow('ticket','ticket created with apikeycanCreateandReturnTickets','title')

        (result['status']).should.equal('success')
        (result['data']['ticketNumber']).should.equal(ticket['ticket_number'])
    end
    
    it 'should fail comment ticket if the apikey permission is wrong' do      
        ticket = $database.getRow('ticket','ticket created with apikeycanCreateandReturnTickets','title')

        result = request('/ticket/comment', {
            content: 'some comment content',
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            apiKey: apikeycanCreateandReturnTickets
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_API_KEY_PERMISSION')
        
        result = request('/ticket/comment', {
            content: 'some comment content',
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            apiKey: apikeycanCreateUsersToken
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_API_KEY_PERMISSION')

        
        result = request('/ticket/comment', {
            content: 'some comment content',
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            apiKey: apikeycanCreateTickets
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_API_KEY_PERMISSION')
    end
    
    it 'should success comment ticket if the apikey permission is correct' do
        ticket = $database.getRow('ticket','ticket created with apikeycanCreateandReturnTickets','title')

        result = request('/ticket/comment', {
            content: 'some comment content',
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            apiKey: apikeycanCommentTickets
        })

        (result['status']).should.equal('success')
    end

    it 'should fail signing up user if the apikey permission is wrong' do
        
        request('/user/logout')            
        result = request('/user/signup', {
            name: 'Petyr Baelish',
            email: 'littlefinget@got.com',
            password: 'Catelyn<3',
            apiKey: apikeycanCreateTickets
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_API_KEY_PERMISSION')

        result = request('/user/signup', {
            name: 'Petyr Baelish',
            email: 'littlefinger@got.com',
            password: 'Catelyn<3',
            apiKey: apikeycanCommentTickets
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_API_KEY_PERMISSION')

        result = request('/user/signup', {
            name: 'Petyr Baelish',
            email: 'littlefinger@got.com',
            password: 'Catelyn<3',
            apiKey: apikeycanCreateandReturnTickets
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_API_KEY_PERMISSION')
    end

    it 'should success signing up user if the apikey permission is correct' do
        result = request('/user/signup', {
            name: 'Petyr Baelish',
            email: 'littlefinger@got.com',
            password: 'Catelyn<3',
            apiKey: apikeycanCreateUsersToken
        })

        (result['status']).should.equal('success')
    end
end
