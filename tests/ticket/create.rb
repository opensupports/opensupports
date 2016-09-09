describe '/ticket/create' do
    request('/user/logout')
    Scripts.createUser('creator@os4.com','creator','Creator')
    Scripts.login('creator@os4.com','creator')

    it 'should fail if invalid token is passed' do
        result = request('/ticket/create', {
            title: 'GG',
            departmentId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: 'INVALID_TOKEN'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('You have no permission to access')

    end

    it 'should fail if title is too short' do
        result = request('/ticket/create', {
            title: 'GG',
            departmentId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('Invalid title')
    end

    it 'should fail if title is very long' do
        result = request('/ticket/create',{
            title: 'I WISH I WAS THE MONSTER YOU THINK I AM. -Tyrion',
            departmentId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('Invalid title')
    end

    it 'should fail if content is too short' do
        result = request('/ticket/create', {
            title: 'Winter is coming',
            content: 'Test',
            departmentId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('Invalid content')
    end

    it 'should fail if content is very long' do
        long_text = ''
        600.times {long_text << 'a'}

        result = request('/ticket/create',{
            title: 'Winter is coming',
            content: long_text,
            departmentId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('Invalid content')

    end

    it 'should fail if departmentId is invalid' do
        result = request('/ticket/create', {
            title: 'Winter is coming',
            content: 'The north remembers',
            departmentId: 30,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('Invalid department')

    end

    it 'should create ticket if pass data is valid' do
        result = request('/ticket/create', {
            title: 'Winter is coming',
            content: 'The north remembers',
            departmentId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        puts result['message']
        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket','Winter is coming','title')
        (ticket['content']).should.equal('The north remembers')
        (ticket['unread']).should.equal('0')
        (ticket['closed']).should.equal('0')
        (ticket['department_id']).should.equal('1')
        (ticket['author_id']).should.equal($csrf_userid)
        (ticket['ticket_number'].size).should.equal(6)

        ticket_user_relation = $database.getRow('ticket_user', ticket['id'],'ticket_id')
        (ticket_user_relation['user_id']).should.equal($csrf_userid)
    end

    it 'should set correct ticket number' do
        result = request('/ticket/create',{
            title: 'Winter is coming1',
            content: 'The north remembers',
            departmentId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        result = request('/ticket/create',{
            title: 'Winter is coming2',
            content: 'The north remembers',
            departmentId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        result = request('/ticket/create',{
            title: 'Winter is coming3',
            content: 'The north remembers',
            departmentId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        ticket0 = $database.getRow('ticket','Winter is coming','title')['ticket_number'].to_i
        ticket1 = $database.getRow('ticket','Winter is coming1','title')['ticket_number'].to_i
        ticket2 = $database.getRow('ticket','Winter is coming2','title')['ticket_number'].to_i
        ticket3 = $database.getRow('ticket','Winter is coming3','title')['ticket_number'].to_i

        (ticket1).should.equal((ticket0 - 100000 + 1 * 176611) % 900000 + 100000)
        (ticket2).should.equal((ticket0 - 100000 + 2 * 176611) % 900000 + 100000)
        (ticket3).should.equal((ticket0 - 100000 + 3 * 176611) % 900000 + 100000)
    end
end
