describe '/user/get-supervised-tickets' do
    request('/user/logout')
    
    supervisor = $database.getRow('user', 'supervisor@opensupports.com', 'email')
    user1 = $database.getRow('user', 'usersupervised1@opensupports.com', 'email')
    user2 = $database.getRow('user', 'usersupervised2@opensupports.com', 'email')
    
    ticketsupervisor = $database.getRow('ticket', 'titlecreateadbySUpervisor', 'title')
    ticketuser1 = $database.getRow('ticket', 'titlecreateadbyusersupervised1', 'title')
    ticketuser2 = $database.getRow('ticket', 'titlecreateadbyusersupervised2', 'title')
    ticketuser3 = $database.getRow('ticket', 'titlecreateadbyusersupervised3', 'title')
    
    
    it 'should fail if supervised users are not valid' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)
        
        result = request('/user/edit-user-list', {
            userIdList: "[30,32,31]",
            userId:  supervisor['id'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        
        request('/user/logout')
        Scripts.login('supervisor@opensupports.com', 'passwordOfSupervisor')
        
        result = request('/user/get-supervised-tickets', {
            supervised_users: "[1000,30]",
            showOwnTickets: 1,
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_SUPERVISED_USERS')
        
        result = request('/user/get-supervised-tickets', {
            supervised_users: "[32,30,1]",
            showOwnTickets: 1,
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_SUPERVISED_USERS')

        
        result = request('/user/get-supervised-tickets', {
            supervised_users: "32",
            showOwnTickets: 1,
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_SUPERVISED_USERS')

        result = request('/user/get-supervised-tickets', {
            supervised_users: "hello",
            showOwnTickets: 1,
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_SUPERVISED_USERS')

        result = request('/user/get-supervised-tickets', {
            supervised_users: "[{'id' :29 , 'staff' true}]",
            showOwnTickets: 1,
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_SUPERVISED_USERS')
    end
    
    it 'should return the tickets of the authors searched' do
        result = request('/user/get-supervised-tickets', {
            supervised_users: "[30,32,31]",
            showOwnTickets: 0,
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('success')
        (result['data']['tickets'].size).should.equal(3)
        (result['data']['tickets'][0]['title']).should.equal(ticketuser3['title'])
        (result['data']['tickets'][1]['title']).should.equal(ticketuser2['title'])
        (result['data']['tickets'][2]['title']).should.equal(ticketuser1['title'])           
    end
    it 'should return the tickets of the authors searched including logged user' do
        result = request('/user/get-supervised-tickets', {
            supervised_users: "[30,32]",
            showOwnTickets: 1,
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('success')
        (result['data']['tickets'].size).should.equal(3) 
        (result['data']['tickets'][0]['title']).should.equal(ticketuser3['title']) 
        (result['data']['tickets'][1]['title']).should.equal(ticketuser1['title']) 
        (result['data']['tickets'][2]['title']).should.equal(ticketsupervisor['title']) 

        result = request('/user/get-supervised-tickets', {
            supervised_users: "[30,32,29]",
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('success')
        (result['data']['tickets'].size).should.equal(3) 
        (result['data']['tickets'][0]['title']).should.equal(ticketuser3['title']) 
        (result['data']['tickets'][1]['title']).should.equal(ticketuser1['title']) 
        (result['data']['tickets'][2]['title']).should.equal(ticketsupervisor['title']) 
    end
end
