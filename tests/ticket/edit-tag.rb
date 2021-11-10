describe '/ticket/edit-tag' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should edit a tag' do
        result = request('/ticket/edit-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 1,
            name: 'TAG1',
            color: '#ff00ff'
        })
        (result['status']).should.equal('success')

        tag = $database.getRow('tag', 1, 'id')

        (tag['name']).should.equal('TAG1')
        (tag['color']).should.equal('#ff00ff')
    end

    it 'should fail if the name already exists' do
        request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'TAG2',
            color: '#0000ff'
        })

        result = request('/ticket/edit-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 2,
            name: 'TAG1',
            color: '#ff00ff'
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
