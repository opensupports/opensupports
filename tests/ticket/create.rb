describe '/ticket/create' do
    request('/user/logout')
    result = request('/user/login', {
        email: 'steve@jobs.com',
        password: 'custom'
    })

    $csrf_userid = result['data']['userId']
    $csrf_token = result['data']['token']

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
        result = request('/ticket/create',{
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
        result = request('/ticket/create',{
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
        (ticket['author_id']).should.equal('1')

        ticket_user_relation = $database.getRow('ticket_user','1','ticket_id')
        (ticket_user_relation['user_id']).should.equal('1')
    end
end