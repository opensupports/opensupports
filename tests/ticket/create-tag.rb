describe '/ticket/create-tag' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should add a tag' do
        result = request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'tag1',
            color: 'blue'
        })
        tag = $database.getRow('tag', 1 , 'id')

        (result['status']).should.equal('success')
        (tag['name']).should.equal('tag1')
        (tag['color']).should.equal('blue')
    end

    it 'should not add tag if already exits' do
        result = request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'tag1',
            color: 'blue'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('TAG_EXISTS')
    end

    it 'should fail if the name is invalid' do
        result = request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            color: 'black'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')

        result = request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'T',
            color: 'black'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')

        long_text = ''
        200.times {long_text << 'a'}

        result = request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: long_text,
            color: 'black'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')
    end
end
