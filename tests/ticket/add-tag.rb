describe '/ticket/add-tag' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)
    Scripts.createStaff('lvl1@opensupports.com', 'pass1', 'name1','1')
    Scripts.createStaff('lvl2@opensupports.com', 'pass2', 'name2','2')

    it 'should add a tag if is a Staff 3 logged' do
        result = request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'tag1',
            color: 'blue'
        })
        tag = $database.getRow('tag', 1 , 'id')

        (request['status']).should.equal('success')
        (tag['name']).should.equal('tag1')
    end

    it 'should add a tag if a Staff 1 is logged' do
      request('/user/logout')
      Scripts.login('lvl1@opensupports.com', 'pass1',true)

      result = request('/ticket/add-tag', {
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token,
          name: 'tag2',
          color: 'red'
      })

      tag = $database.getRow('tag', 2 , 'id')

      (result['status']).should.equal('success')
      (tag['name']).should.equal('tag2')
    end

    it 'should add a tag if a Staff 2 is logged' do
      request('/user/logout')
      Scripts.login('lvl2@opensupports.com', 'pass2',true)

      result = request('/ticket/add-tag', {
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token,
          name: 'tag3',
          color:'green'
      })

      tag = $database.getRow('tag', 3 , 'id')

      (result['status']).should.equal('success')
      (tag['name']).should.equal('tag3')
    end

    it 'should fail if the name is invalid' do
        result = request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            color: 'black'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')

        result = request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'T',
            color: 'black'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')

        long_text = ''
        200.times {long_text << 'a'}

        result = request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: long_text,
            color: 'black'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')

        result = request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'tag1',
            color: 'black'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('TAG_EXISTS')

    end

    it 'should fail if a user is logged' do
        request('/user/logout')
        Scripts.login()

        result = request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'usertag',
            color: 'pink'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
        request('/user/logout')
    end
end
