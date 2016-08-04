describe '/ticket/create' do
    request('/user/logout')
    result = request('/user/login', {
        email: 'steve@jobs.com',
        password: 'custom'
    })

    $csrf_userid = result['data']['userId']
    $csrf_token = result['data']['token']

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
    end
end