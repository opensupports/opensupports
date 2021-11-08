describe '/ticket/create-tag' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should add a tag' do
        result = request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'tag1',
            color: '#0000ff'
        })
        tag = $database.getRow('tag', 1 , 'id')

        (result['status']).should.equal('success')
        (tag['name']).should.equal('tag1')
        (tag['color']).should.equal('#0000ff')
    end

    it 'should not add tag if already exits' do
        result = request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'tag1',
            color: '#ffffff'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('TAG_EXISTS')
    end

    it 'should fail if the name is invalid' do
        result = request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            color: '#ffff00'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')

        result = request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: '',
            color: '#0000ff'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')

        long_text = ''
        201.times {long_text << 'a'}

        result = request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: long_text,
            color: '#ffff00'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')
    end

    it 'should fail if color is invalid' do
        result = request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'valid name 1',
            color: '00ff00'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_COLOR')

        result = request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'valid name 2',
            color: 'blue'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_COLOR')

        result = request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'valid name 3',
            color: '#00ff00ee'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_COLOR')
    end
end
