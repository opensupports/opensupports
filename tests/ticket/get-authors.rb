describe '/ticket/get-authors/' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)
    Scripts.createUser('userauthor@os4.com', 'passwordofuserauthor', 'userauthorname')    
    
    it 'should fail if the list is invalid' do
        result = request('/ticket/get-authors', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            authors: '[{"isStaff":11,"id":1}]'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_LIST')

        result = request('/ticket/get-authors', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            authors: '[{"isStaff":1,"id":14125125215515}]'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_LIST')

        result = request('/ticket/get-authors', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            authors: '[{"isStaff":hi,"id":1}]'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_LIST')

        result = request('/ticket/get-authors', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            authors: '[{"isStaff":11,"id": hi}]'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_LIST')
        
        result = request('/ticket/get-authors', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            authors: 'list of authors'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_LIST')
    end

    it 'should succed if a empty list is given' do
        result = request('/ticket/get-authors', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            authors: '[]'
        })

        (result['status']).should.equal('success')
        (result['data']).should.equal([])
    end

    it 'should succed if you try to get a user' do
        userauthor = $database.getRow('user', 'userauthor@os4.com', 'email')
        authorsstring = '[{"isStaff":0,"id":'
        authorsstring.concat(userauthor['id'].to_s)
        authorsstring.concat('}]')

        result = request('/ticket/get-authors', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            authors: authorsstring 
        })

        (result['status']).should.equal('success')
        (result['data'][0]['email']).should.equal(userauthor['email'])
        (result['data'][0]['id']).should.equal(userauthor['id'].to_s)
        (result['data'][0]['name']).should.equal(userauthor['name'])
    end

    it 'should succed if you try to get a staff' do
        staffauthor = $database.getRow('staff', $staff[:email], 'email')
        authorsstring = '[{"isStaff":1,"id":'
        authorsstring.concat(staffauthor['id'].to_s)
        authorsstring.concat('}]')

        result = request('/ticket/get-authors', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            authors: authorsstring 
        })

        (result['status']).should.equal('success')
        (result['data'][0]['email']).should.equal(staffauthor['email'])
        (result['data'][0]['id']).should.equal(staffauthor['id'].to_s)
        (result['data'][0]['name']).should.equal(staffauthor['name'])
    end
    it 'should succed if you try to get a staff and a user' do
        userauthor = $database.getRow('user', 'userauthor@os4.com', 'email')
        staffauthor = $database.getRow('staff', $staff[:email], 'email')
        authorsstring = '[{"isStaff":1,"id":'
        authorsstring.concat(staffauthor['id'].to_s)
        authorsstring.concat('},{"isStaff":0,"id":')
        authorsstring.concat(userauthor['id'].to_s)
        authorsstring.concat('}]')

        result = request('/ticket/get-authors', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            authors: authorsstring 
        })

        (result['status']).should.equal('success')
        (result['data'][0]['email']).should.equal(staffauthor['email'])
        (result['data'][0]['id']).should.equal(staffauthor['id'].to_s)
        (result['data'][0]['name']).should.equal(staffauthor['name'])
        (result['data'][1]['email']).should.equal(userauthor['email'])
        (result['data'][1]['id']).should.equal(userauthor['id'].to_s)
        (result['data'][1]['name']).should.equal(userauthor['name'])

    end
    it 'should succed if you try to get a author without duplicate' do
        staffauthor = $database.getRow('staff', $staff[:email], 'email')
        authorsstring = '[{"isStaff":1,"id":'
        authorsstring.concat(staffauthor['id'].to_s)
        authorsstring.concat('},{"isStaff":1,"id":')
        authorsstring.concat(staffauthor['id'].to_s)
        authorsstring.concat('}]')

        result = request('/ticket/get-authors', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            authors: authorsstring 
        })
        (result['status']).should.equal('success')
        (result['data'][0]['email']).should.equal(staffauthor['email'])
        (result['data'][0]['id']).should.equal(staffauthor['id'].to_s)
        (result['data'][0]['name']).should.equal(staffauthor['name'])
        (result['data'].size).should.equal(2)
    end
end
