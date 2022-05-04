describe '/ticket/edit-title' do

    Scripts.logout()
    Scripts.login()
    Scripts.createTicket('Valar Morghulis','content of the ticket made by an user')
    ticket = $database.getRow('ticket', 'Valar Morghulis', 'title')
    ticketNumber = ticket['ticket_number']

    it 'should fail change title of the ticket if the title is invalid' do
        result = request('/ticket/edit-title', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            title: '',
            ticketNumber: ticket['ticket_number']
        })

        ticket = $database.getRow('ticket', ticketNumber, 'ticket_number')

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_TITLE')
    end

    it 'should change title of the ticket if the author user tries it' do
        result = request('/ticket/edit-title', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            title: 'Valar dohaeris',
            ticketNumber: ticket['ticket_number']
        })

        ticket = $database.getRow('ticket', ticketNumber, 'ticket_number')

        (result['status']).should.equal('success')
        (ticket['title']).should.equal('Valar dohaeris')
        (ticket['edited_title']).should.equal(1)
    end

    it 'should change the title of the ticket if staff is logged' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        result = request('/ticket/edit-title', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            title: 'Valar dohaeris by Staff',
            ticketNumber: ticket['ticket_number']
        })

        ticket = $database.getRow('ticket', ticketNumber, 'ticket_number')

        (result['status']).should.equal('success')
        (ticket['title']).should.equal('Valar dohaeris by Staff')
        (ticket['edited_title']).should.equal(1)
    end

    it 'should not change the title if the user is not the author' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        Scripts.createTicket('Winterfell')
        ticket = $database.getRow('ticket', 'Winterfell', 'title')

        Scripts.logout()
        Scripts.login()

        result = request('/ticket/edit-title', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            title: 'Casterly Rock',
            ticketNumber: ticket['ticket_number']
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
    end

end
