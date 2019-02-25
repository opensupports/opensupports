describe '/ticket/edit-tag' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should edit a tag' do
        result = request('/ticket/edit-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 1,
            name: 'TAG1',
            color: 'yellow'
        })
        (result['status']).should.equal('success')

        tag = $database.getRow('tag', 1, 'id')

        (tag['name']).should.equal('TAG1')
        (tag['color']).should.equal('yellow')
    end

    it 'should fail if the name already exists' do
        request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'TAG2',
            color: 'blue'
        })

        result = request('/ticket/edit-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 2,
            name: 'TAG1'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('TAG_EXISTS')
    end

    it 'should fail if the tagId is invalid' do
        result = request('/ticket/edit-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 100
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_TAG')
    end
end
