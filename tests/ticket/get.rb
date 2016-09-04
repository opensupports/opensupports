describe '/ticket/get/' do
    request('/user/logout')
    Scripts.createUser('cersei@os4.com', 'cersei','Cersei Lannister')
    result = request('/user/login', {
        email: 'cersei@os4.com',
        password: 'cersei'
    })
    $csrf_userid = result['data']['userId']
    $csrf_token = result['data']['token']
    result = request('/ticket/create', {
        title: 'Should we pay?',
        content: 'A Lannister always pays his debts.',
        departmentId: 1,
        csrf_userid: $csrf_userid,
        csrf_token: $csrf_token
    })
    @ticketNumber = result['data']['ticketNumber']

    #it 'should fail if ticketNumber is invalid' do

    #end

    #it 'should fail if ticket does not belong to user' do

    #end

    it 'should successfully return the ticket information' do
        result = request('/ticket/get', {
            ticketNumber: @ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        ticket = $database.getRow('ticket', @ticketNumber, 'ticket_number')


        (result['status']).should.equal('success')
        (result['data']['ticketNumber']).should.equal(ticket['ticket_number'])
        (result['data']['title']).should.equal(ticket['title'])
        (result['data']['content']).should.equal(ticket['content'])
        (result['data']['department']['id']).should.equal('1')
        (result['data']['department']['name']).should.equal($database.getRow('department', 1)['name'])
        (result['data']['date']).should.equal(ticket['date'])
        (result['data']['file']).should.equal(ticket['file'])
        (result['data']['language']).should.equal(ticket['language'])
        (result['data']['unread']).should.equal(false)
        (result['data']['author']['name']).should.equal('Cersei Lannister')
        (result['data']['author']['email']).should.equal('cersei@os4.com')
        (result['data']['owner']).should.equal([])
        (result['data']['comments']).should.equal([])
    end
end