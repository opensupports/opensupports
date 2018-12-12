describe '/ticket/delete-tag' do

    it 'should fail if a user is logged' do
        request('/user/logout')
        Scripts.login()

        result = request('/ticket/delete-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 1
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
        request('/user/logout')
    end

    Scripts.login($staff[:email], $staff[:password], true)

    it 'should delete a tag if is a Staff 3 logged' do
        result = request('/ticket/delete-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 1
        })

        (request['status']).should.equal('success')
    end

    it 'should delete a tag if a Staff 1 is logged' do
      request('/user/logout')
      Scripts.login('lvl1@opensupports.com', 'pass1',true)

      result = request('/ticket/add-tag', {
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token,
          tagId: 2
      })

      (result['status']).should.equal('success')
    end

    it 'should delete a tag if a Staff 2 is logged' do
      request('/user/logout')
      Scripts.login('lvl2@opensupports.com', 'pass2',true)

      result = request('/ticket/delete-tag', {
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token,
          tagId: 3
      })

      (result['status']).should.equal('success')
    end

    it 'should fail if the tagId is invalid' do
        result = request('/ticket/delete-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 1000
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_TAG')
    end
end
