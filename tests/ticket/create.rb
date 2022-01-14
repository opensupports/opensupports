describe '/ticket/create' do
    Scripts.logout()
    Scripts.createUser('creator@os4.com','creator','Creator')
    Scripts.login('creator@os4.com','creator')

    it 'should fail if invalid token is passed' do
        result = request('/ticket/create', {
            title: 'GG',
            departmentId: 1,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: 'INVALID_TOKEN'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')

    end
    it 'should fail if title is very long' do
        long_text = ''
        300.times {long_text << 'a'}

        result = request('/ticket/create',{
            title: long_text,
            departmentId: 1,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_TITLE')
    end

    it 'should craete ticket with a short content' do
        result = request('/ticket/create', {
            title: 'Winter is coming',
            content: 'Test',
            departmentId: 1,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
    end

    it 'should fail if the ticket has a very large content' do
        long_text = ''
        10001.times {long_text << 'a'}

        result = request('/ticket/create',{
            title: 'Winter is coming',
            content: long_text,
            departmentId: 1,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_CONTENT')

    end

    it 'should fail if departmentId is invalid' do
        result = request('/ticket/create', {
            title: 'Winter is coming',
            content: 'The north remembers',
            departmentId: 30,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_DEPARTMENT')

    end
    it 'should fail if an user tries to create a ticket with a private department' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        result = request('/system/add-department', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'useless private deapartment',
            private: 1
        })

        row = $database.getRow('department', 'useless private deapartment', 'name')

        Scripts.logout()
        Scripts.createUser('user@os4.com', 'loginpass')
        Scripts.login('user@os4.com', 'loginpass')

        result = request('/ticket/create', {
            title: 'Winter is here',
            content: 'The king in the north',
            departmentId: row['id'],
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_DEPARTMENT')

        Scripts.logout()
    end

    it 'should create ticket if pass data is valid' do
        Scripts.login('creator@os4.com','creator')

        result = request('/ticket/create', {
            title: 'Winter is coming!',
            content: 'The north remembers',
            departmentId: 1,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket','Winter is coming!','title')
        (ticket['content']).should.equal('The north remembers')
        (ticket['unread']).should.equal(0)
        (ticket['closed']).should.equal(0)
        (ticket['department_id']).should.equal(1)
        (ticket['author_id']).should.equal($csrf_userid.to_i)
        ((Math.log10(ticket['ticket_number'].to_i)).ceil).should.equal(6)

        ticket_user_relation = $database.getRow('ticket_user', ticket['id'],'ticket_id')
        (ticket_user_relation['user_id']).should.equal($csrf_userid.to_i)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('CREATE_TICKET')
    end

    it 'should set correct ticket number' do
        result = request('/ticket/create',{
            title: 'Winter is coming1',
            content: 'The north remembers',
            departmentId: 1,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        result = request('/ticket/create',{
            title: 'Winter is coming2',
            content: 'The north remembers',
            departmentId: 1,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        result = request('/ticket/create',{
            title: 'Winter is coming3',
            content: 'The north remembers',
            departmentId: 1,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        ticket_number_gap = $database.getRow('setting', 'ticket-gap', 'name')['value'].to_i

        ticket0 = $database.getRow('ticket','Winter is coming!','title')['ticket_number'].to_i
        ticket1 = $database.getRow('ticket','Winter is coming1','title')['ticket_number'].to_i
        ticket2 = $database.getRow('ticket','Winter is coming2','title')['ticket_number'].to_i
        ticket3 = $database.getRow('ticket','Winter is coming3','title')['ticket_number'].to_i

        (ticket1).should.equal((ticket0 - 100000 + 1 * ticket_number_gap) % 900000 + 100000)
        (ticket2).should.equal((ticket0 - 100000 + 2 * ticket_number_gap) % 900000 + 100000)
        (ticket3).should.equal((ticket0 - 100000 + 3 * ticket_number_gap) % 900000 + 100000)
    end

    it 'should be able to create a ticket while being staff' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        result = request('/ticket/create', {
            title: 'created by staff',
            content: 'The staff created it believing this path returns the ticketnumber',
            departmentId: 1,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')
        
        ticket = $database.getRow('ticket', 'The staff created it believing this path returns the ticketnumber', 'content')
        (ticket['author_id']).should.equal(nil)
        (ticket['author_staff_id']).should.equal(1)

        $ticketNumberByStaff = ticket['ticket_number']
        Scripts.logout()
    end
end
