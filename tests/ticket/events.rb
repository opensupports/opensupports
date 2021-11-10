describe 'Ticket Events' do
    Scripts.logout()
    Scripts.createUser('tyrion@opensupports.com', 'tyrionl', 'Tyrion Lannister')

    it 'should add events correctly' do
        Scripts.login('tyrion@opensupports.com', 'tyrionl')
        response = request('/ticket/create', {
            title: 'Ticket with many events',
            content: 'This is a ticket with many events',
            departmentId: 1,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        ticket = $database.getRow('ticket', 'Ticket with many events','title')
        
        ticketNumber = ticket['ticket_number']

        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        request('/staff/assign-ticket', {
            ticketNumber: ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        request('/ticket/comment', {
            content: 'This is a comment made by a staff',
            ticketNumber: ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        request('/staff/un-assign-ticket', {
            ticketNumber: ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        request('/staff/assign-ticket', {
            ticketNumber: ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        request('/ticket/change-department', {
            departmentId: 3,
            ticketNumber: ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        request('/ticket/close', {
            ticketNumber: ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        Scripts.logout()
        Scripts.login('tyrion@opensupports.com', 'tyrionl')
        request('/ticket/re-open', {
            ticketNumber: ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        request('/ticket/comment', {
            content: 'This is a comment made by a regular user',
            ticketNumber: ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        result = request('/ticket/get', {
            ticketNumber: ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['data']['events'][0]['type']).should.equal('ASSIGN')
        (result['data']['events'][0]['author']['name']).should.equal('Emilia Clarke')
        (result['data']['events'][0]['author']['staff']).should.equal(true)

        (result['data']['events'][1]['type']).should.equal('COMMENT')
        (result['data']['events'][1]['content']).should.equal('This is a comment made by a staff')
        (result['data']['events'][1]['author']['name']).should.equal('Emilia Clarke')
        (result['data']['events'][1]['author']['staff']).should.equal(true)

        (result['data']['events'][2]['type']).should.equal('UN_ASSIGN')
        (result['data']['events'][2]['author']['name']).should.equal('Emilia Clarke')
        (result['data']['events'][2]['author']['staff']).should.equal(true)

        (result['data']['events'][3]['type']).should.equal('ASSIGN')
        (result['data']['events'][3]['author']['name']).should.equal('Emilia Clarke')
        (result['data']['events'][3]['author']['staff']).should.equal(true)

        (result['data']['events'][4]['type']).should.equal('DEPARTMENT_CHANGED')
        (result['data']['events'][4]['content']).should.equal('Suggestions')
        (result['data']['events'][4]['author']['name']).should.equal('Emilia Clarke')
        (result['data']['events'][4]['author']['staff']).should.equal(true)

        (result['data']['events'][5]['type']).should.equal('CLOSE')
        (result['data']['events'][5]['author']['name']).should.equal('Emilia Clarke')
        (result['data']['events'][5]['author']['staff']).should.equal(true)

        (result['data']['events'][6]['type']).should.equal('RE_OPEN')
        (result['data']['events'][6]['author']['name']).should.equal('Tyrion Lannister')
        (result['data']['events'][6]['author']['staff']).should.equal(false)

        (result['data']['events'][7]['type']).should.equal('COMMENT')
        (result['data']['events'][7]['content']).should.equal('This is a comment made by a regular user')
        (result['data']['events'][7]['author']['name']).should.equal('Tyrion Lannister')
        (result['data']['events'][7]['author']['staff']).should.equal(false)
    end
end
