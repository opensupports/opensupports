describe '/system/apikey-permissions' do
    Scripts.logout()
   
    Scripts.login($staff[:email], $staff[:password], true)
    
    apikeycanCreateUsersToken = Scripts.createAPIKey('create users',canCreateUsers=1, canCreateTickets=0, canCheckTickets=0,  shouldReturnTicketNumber=0)['data']
    apikeycanCreateTickets = Scripts.createAPIKey('create tickets',canCreateUsers=0, canCreateTickets=1, canCheckTickets=0,  shouldReturnTicketNumber=0)['data']
    apikeycanCheckTickets = Scripts.createAPIKey('comment tickets',canCreateUsers=0, canCreateTickets=0, canCheckTickets=1,  shouldReturnTicketNumber=0)['data']
    apikeycanReturnTickets = Scripts.createAPIKey('create and return tickets',canCreateUsers=0, canCreateTickets=1, canCheckTickets=0,  shouldReturnTicketNumber=1)['data']
    
    request('/system/disable-mandatory-login', {
            "csrf_userid" => $csrf_userid,
            "csrf_token" => $csrf_token,
            "password" => $staff[:password]
    })
    request('/system/edit-settings', {
        "csrf_userid" => $csrf_userid,
        "csrf_token" => $csrf_token,
        "recaptcha-private" => "THISISVALID"
    })
    Scripts.logout()

    it 'should fail ticket create if the apikey does not have create ticket permission' do
        result = request('/ticket/create', {
            language: 'en',
            email: 'valid@os4.com',
            name: 'validname',
            title: 'try of title Ticket',
            content: 'try of content Ticket',
            departmentId: 1,
            captcha: 'invalid captcha',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_CAPTCHA')

        result = request('/ticket/create', {
            language: 'en',
            email: 'valid@os4.com',
            name: 'validname',
            title: 'try of title Ticket',
            content: 'try of content Ticket',
            departmentId: 1,
            captcha: 'THISISVALID',
            apiKey: apikeycanCheckTickets,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_CAPTCHA')
    end

    it 'should create ticket if the apikey has the correct permission' do
        result = request('/ticket/create', {
            language: 'en',
            email: 'valid@os4.com',
            title: 'ticket created with apikeycanCreateTickets',
            name: 'validname',
            content: 'content of Ticket apikeycanCreateTickets',
            departmentId: 1,
            captcha: 'INVALID',
            apiKey: apikeycanCreateTickets,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')
        (result['data']).should.equal(nil)

        result = request('/ticket/create', {
            language: 'en',
            email: 'valid@os4.com',
            title: 'ticket created with apikeycanReturnTickets',
            name: 'validname',
            content: 'content of Ticket apikeycanReturnTickets',
            departmentId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            captcha: 'INVALID',
            apiKey: apikeycanReturnTickets   
        })
        ticket = $database.getRow('ticket','ticket created with apikeycanReturnTickets','title')

        (result['status']).should.equal('success')
        (result['data']['ticketNumber']).should.equal(ticket['ticket_number'])
    end
    
    it 'should fail comment ticket if the apikey permission is wrong' do      
        ticket = $database.getRow('ticket','ticket created with apikeycanReturnTickets','title')
        author = $database.getRow('user',ticket['author_id'],'id')

        result = request('/ticket/check', {
            email: author['email'],
            content: 'some comment content',
            ticketNumber: ticket['ticket_number'],
            captcha: 'INVALID',
            apiKey: apikeycanReturnTickets
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_CAPTCHA')
        
        result = request('/ticket/check', {
            email: author['email'],
            content: 'some comment content',
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            captcha: 'INVALID',
            apiKey: apikeycanCreateUsersToken
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_CAPTCHA')

        
        result = request('/ticket/check', {
            email: author['email'],
            content: 'some comment content',
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            captcha: 'INVALID',
            apiKey: apikeycanCreateTickets
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_CAPTCHA')
    end

    it 'should success comment ticket if the apikey permission is correct' do
        ticket = $database.getRow('ticket','ticket created with apikeycanReturnTickets','title')
        author = $database.getRow('user',ticket['author_id'],'id')

        result = request('/ticket/check', {
            email: author['email'],
            content: 'some comment content',
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            captcha: 'INVALID',
            apiKey: apikeycanCheckTickets
        })

        (result['status']).should.equal('success')
    end

    it 'should fail signing up user if the apikey permission is wrong' do
        
        Scripts.logout()            
        result = request('/user/signup', {
            name: 'Petyr Baelish',
            email: 'littlefinger@got.com',
            password: 'Catelyn<3',
            captcha: 'INVALID',
            apiKey: apikeycanCreateTickets
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_CAPTCHA')

        result = request('/user/signup', {
            name: 'Petyr Baelish',
            email: 'littlefinger@got.com',
            password: 'Catelyn<3',
            captcha: 'INVALID',
            apiKey: apikeycanCheckTickets
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_CAPTCHA')

        result = request('/user/signup', {
            name: 'Petyr Baelish',
            email: 'littlefinger@got.com',
            password: 'Catelyn<3',
            captcha: 'INVALID',
            apiKey: apikeycanReturnTickets
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_CAPTCHA')
    end

    it 'should success signing up user if the apikey permission is correct' do
        result = request('/user/signup', {
            name: 'Petyr Baelish',
            email: 'littlefinger@got.com',
            password: 'Catelyn<3',
            captcha: 'INVALID',
            apiKey: apikeycanCreateUsersToken
        })

        (result['status']).should.equal('success')

        Scripts.login($staff[:email], $staff[:password], true)
        request('/system/edit-settings', {
            "csrf_userid" => $csrf_userid,
            "csrf_token" => $csrf_token,
            "recaptcha-private" => ""
        })
        Scripts.logout()
    end
end
