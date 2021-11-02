describe '/ticket/get/' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)    
    
    result= request('/system/add-api-key', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'APIkeyToTicketget',
            shouldReturnTicketNumber: 'true',
            canCreateTickets: 1
    })
    (result['status']).should.equal('success')
    $token = result['data'];

    Scripts.logout()

    Scripts.createUser('cersei@os4.com', 'cersei','Cersei Lannister')
    Scripts.createUser('not_ticket_getter@os4.com', 'not_ticket_getter','No Author')

    before do
        result = Scripts.login('cersei@os4.com', 'cersei')
        $csrf_userid = result['userId']
        $csrf_token = result['token']
        result = request('/ticket/create', {
            title: 'Should we pay?',
            content: 'A Lannister always pays his debts.',
            departmentId: 1,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            apiKey: $token
        })
        @ticketNumber = result['data']['ticketNumber']
        
        request('/ticket/comment', {
            ticketNumber: @ticketNumber,
            content: 'some valid comment made',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
    end

    it 'should fail if ticketNumber is invalid' do
        result = request('/ticket/get', {
            ticketNumber: (@ticketNumber.to_i + 1).to_s,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
    end

    it 'should fail if ticket does not belong to user' do
        Scripts.logout()
        result = Scripts.login('not_ticket_getter@os4.com', 'not_ticket_getter')

        $csrf_userid = result['userId']
        $csrf_token = result['token']
        result = request('/ticket/get', {
            ticketNumber: @ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
    end

    it 'should successfully return the ticket information' do
        result = Scripts.login('cersei@os4.com', 'cersei')
        $csrf_userid = result['userId']
        $csrf_token = result['token']

        result = request('/ticket/get', {
            ticketNumber: @ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        ticket = $database.getRow('ticket', @ticketNumber, 'ticket_number')


        (result['status']).should.equal('success')
        (result['data']['ticketNumber']).should.equal(ticket['ticket_number'].to_s)
        (result['data']['title']).should.equal(ticket['title'])
        (result['data']['content']).should.equal(ticket['content'])
        (result['data']['department']['id']).should.equal('1')
        (result['data']['department']['name']).should.equal($database.getRow('department', 1)['name'])
        (result['data']['date'].to_i).should.equal(ticket['date'])
        (result['data']['file']).should.equal(ticket['file'])
        (result['data']['language']).should.equal(ticket['language'])
        (result['data']['unread']).should.equal(false)
        (result['data']['author']['name']).should.equal('Cersei Lannister')
        (result['data']['author']['email']).should.equal('cersei@os4.com')
        (result['data']['owner']).should.equal(nil)
        (result['data']['events'].size).should.equal(1)
        (result['data']['events'][0]['type']).should.equal('COMMENT')
        (result['data']['events'][0]['content']).should.equal('some valid comment made')
    end
    it 'should successfully return the ticket information if staff member serves to the department of the ticket' do
        Scripts.logout()
        Scripts.login('cersei@os4.com', 'cersei')
        Scripts.createTicket('titleofticket87','contentoftheticket87',1)
        Scripts.createTicket('2titleofticket87','2contentoftheticket87',1)
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        ticket = $database.getRow('ticket','titleofticket87', 'title')

        result = request('/ticket/get', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        (result['data']['ticketNumber']).should.equal(ticket['ticket_number'].to_s)
        (result['data']['title']).should.equal('titleofticket87')
        (result['data']['content']).should.equal('contentoftheticket87')

    end
    it 'should successfully return the ticket information if staff member does not serve to the deparment of the ticket but is author' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        Scripts.createTicket('titleoftheticket107','contentoftheticket107',1)
        ticket = $database.getRow('ticket','titleoftheticket107', 'title')

        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[]'
        })

        result = request('/ticket/get', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        (result['data']['ticketNumber'].to_i).should.equal(ticket['ticket_number'])
        (result['data']['title']).should.equal('titleoftheticket107')
        (result['data']['content']).should.equal('contentoftheticket107')
    end

    it 'should fail if staff member does not serve to the department of the ticket and is not the author' do
        ticket = $database.getRow('ticket','2titleofticket87', 'title')
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        
        result = request('/ticket/get', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
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
end
