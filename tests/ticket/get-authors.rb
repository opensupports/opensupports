describe '/ticket/get-authors/' do
    
    it 'should fail if a user is loged' do
        request('/user/logout')
        Scripts.login('tyrion@opensupports.com', 'tyrionl')
        
        result = request('/ticket/get-authors', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            query: 'hello world'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
        
        
    end
    
    it 'should fail if blackList is invalid' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)
        Scripts.createUser(email = 'eemilia@jobs.com', password = 'custompassword', name = 'eemilia')

        result = request('/ticket/get-authors', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            query: 'hello world',
            blackList: [{'staff':2,'id':2}]
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_BLACK_LIST')

        result = request('/ticket/get-authors', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            query: 'hello world',
            blackList: [{'staff':'level two','id':2}]
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_BLACK_LIST')

        result = request('/ticket/get-authors', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            query: 'hello world',
            blackList: [{'staff':1,'id':'four'}]
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_BLACK_LIST')
    end
    
    it 'should return the correct authors' do

        result = request('/ticket/get-authors', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            query: 'emilia'
        })
        (result['status']).should.equal('success')
        (result['data']['authors'].size).should.equal(2)
        (result['data']['authors'][0]['name']).should.equal('Emilia Clarke')
        (result['data']['authors'][1]['name']).should.equal('eemilia')

        result = request('/ticket/get-authors', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            query: 'emilia',
            blackList: '[{"staff":1,"id":1}]'
        })
        (result['status']).should.equal('success')
        (result['data']['authors'].size).should.equal(1)
        (result['data']['authors'][0]['name']).should.equal('eemilia')
    end
end