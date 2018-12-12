describe '/ticket/edit-tag' do
    request('/user/logout')

    Scripts.login($staff[:email], $staff[:password], true)

    it 'should edit a tag if is a Staff 3 logged' do
        result = request('/ticket/edit-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 1,
            name: 'TAG1',
            color: 'yellow'
        })
        tag = $database.getRow('tag', 1, 'id')

        (tag['name']).should.equal('TAG1')
        (tag['color']).should.equal('yellow')
        (request['status']).should.equal('success')
    end

    it 'should edit a tag if a Staff 1 is logged' do
      request('/user/logout')
      Scripts.login('lvl1@opensupports.com', 'pass1',true)

      result = request('/ticket/edit-tag', {
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token,
          tagId: 2,
          name:'TAG2',
          color:'orange'
      })

      tag = $database.getRow('tag', 2 , 'id')

      (result['status']).should.equal('success')
      (tag['name']).should.equal('TAG2')
      (tag['color']).should.equal('orange')
    end

    it 'should edit a tag if a Staff 2 is logged' do
      request('/user/logout')
      Scripts.login('lvl2@opensupports.com', 'pass2',true)

      result = request('/ticket/edit-tag', {
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token,
          tagId:  3,
          name: 'TAG3',
          color: 'grey'
      })

      tag = $database.getRow('tag', 3 , 'id')

      (tag['name']).should.equal('TAG3')
      (tag['color']).should.equal('grey')
      (result['status']).should.equal('success')
    end

    it 'should fail if the name already exists' do

        result = request('/ticket/edit-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 1,
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

    it 'should fail if a user is logged' do
        request('/user/logout')
        Scripts.login()

        result = request('/ticket/edit-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 1,
            name: 'usertag',
            color:'pink'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
        request('/user/logout')
    end
end
