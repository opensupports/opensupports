describe '/user/ban' do

    Scripts.logout()
    result = request('/user/login', {
        email: $staff[:email],
        password: $staff[:password],
        staff: true
    })
    (result['status']).should.equal('success')

    $csrf_userid = result['data']['userId']
    $csrf_token = result['data']['token']

    it 'should ban user' do
        result = request('/user/ban', {
            email: 'nothing@hotmail.com',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        user = $database.getRow('ban', 1 , 'id')
        (user['email']).should.equal('nothing@hotmail.com')

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('BAN_USER')
    end

    it 'should get ban list' do
        result = request('/user/list-ban', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['data'][0]).should.equal('nothing@hotmail.com')

    end

    it 'should not ban user if it is already banned' do
        result = request('/user/ban', {
            email: 'nothing@hotmail.com',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('ALREADY_BANNED')

    end

    it 'should un-ban user if it is already banned' do
        result = request('/user/un-ban', {
            email: 'nothing@hotmail.com',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        user = $database.getRow('ban', 1 , 'id')
        (user).should.equal(nil)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('UN_BAN_USER')
    end

    it 'should not un-ban user if it is not banned' do
        result = request('/user/un-ban', {
            email: 'nothing@hotmail.com',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_EMAIL')

    end

end
