describe '/ticket/get-tags' do

    it 'should fail if a user is logged' do
        request('/user/logout')
        Scripts.login()

        result = request('/ticket/get-tags', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
        request('/user/logout')
    end

    Scripts.login($staff[:email], $staff[:password], true)

    it 'should get the tags if is a Staff 3 logged' do
        result = request('/ticket/get-tags', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (request['status']).should.equal('success')
        (request['data'][0]['name']).should.equal('TAG1')
        (request['data'][0]['color']).should.equal('yellow')
        (request['data'][1]['name']).should.equal('TAG2')
        (request['data'][1]['color']).should.equal('orange')
        (request['data'][2]['name']).should.equal('TAG3')
        (request['data'][2]['color']).should.equal('grey')

    end

    it 'should get the tags if a Staff 1 is logged' do
      request('/user/logout')
      Scripts.login('lvl1@opensupports.com', 'pass1',true)

      result = request('/ticket/get-tags', {
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token
      })

      (request['status']).should.equal('success')
      (request['data'][0]['name']).should.equal('TAG1')
      (request['data'][0]['color']).should.equal('yellow')
      (request['data'][1]['name']).should.equal('TAG2')
      (request['data'][1]['color']).should.equal('orange')
      (request['data'][2]['name']).should.equal('TAG3')
      (request['data'][2]['color']).should.equal('grey')
    end

    it 'should get the tags if a Staff 2 is logged' do
      request('/user/logout')
      Scripts.login('lvl2@opensupports.com', 'pass2',true)

      result = request('/ticket/get-tags', {
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token
      })

      (request['status']).should.equal('success')
      (request['data'][0]['name']).should.equal('TAG1')
      (request['data'][0]['color']).should.equal('yellow')
      (request['data'][1]['name']).should.equal('TAG2')
      (request['data'][1]['color']).should.equal('orange')
      (request['data'][2]['name']).should.equal('TAG3')
      (request['data'][2]['color']).should.equal('grey')
    end
end
