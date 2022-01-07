describe '/user/get-supervised-tickets' do
    Scripts.logout()
    
    supervisor = $database.getRow('user', 'supervisor@opensupports.com', 'email')
    user1 = $database.getRow('user', 'usersupervised1@opensupports.com', 'email')
    user2 = $database.getRow('user', 'usersupervised2@opensupports.com', 'email')
    
    ticketsupervisor = $database.getRow('ticket', 'titlecreateadbySUpervisor', 'title')
    ticketuser1 = $database.getRow('ticket', 'titlecreateadbyusersupervised1', 'title')
    ticketuser2 = $database.getRow('ticket', 'titlecreateadbyusersupervised2', 'title')
    ticketuser3 = $database.getRow('ticket', 'titlecreateadbyusersupervised3', 'title')
    
    
    it 'should fail if supervised users are not valid' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        
        result = request('/user/edit-supervised-list', {
            userIdList: "[31,33,32]",
            userId:  supervisor['id'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        
        Scripts.logout()
        Scripts.login('supervisor@opensupports.com', 'passwordOfSupervisor')
        
        result = request('/user/get-supervised-tickets', {
            supervisedUsers: "[1000,31]",
            showOwnTickets: 1,
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_SUPERVISED_USERS')
        
        result = request('/user/get-supervised-tickets', {
            supervisedUsers: "[33,31,1]",
            showOwnTickets: 1,
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_SUPERVISED_USERS')

        
        result = request('/user/get-supervised-tickets', {
            supervisedUsers: "33",
            showOwnTickets: 1,
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_SUPERVISED_USERS')

        result = request('/user/get-supervised-tickets', {
            supervisedUsers: "hello",
            showOwnTickets: 1,
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_SUPERVISED_USERS')

        result = request('/user/get-supervised-tickets', {
            supervisedUsers: "[{'id' :30 , 'staff' true}]",
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
            supervisedUsers: "[31,33,32]",
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
            supervisedUsers: "[31,33]",
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
            supervisedUsers: "[31,33,30]",
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
    
    it 'should return empty list if supervised users is empty and show own tickets off' do
        result = request('/user/get-supervised-tickets', {
            supervisedUsers: "[]",
            showOwnTickets: 0,
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('success')
        (result['data']).should.equal([])  
    end
    it 'should works propertly if 2 supervisors has the same users' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        Scripts.createUser('supervisor2@opensupports.com', 'usersupervised2', 'supervisor Guy2')
        supervisor2 = $database.getRow('user', 'supervisor2@opensupports.com', 'email')
    
        result = request('/user/edit-supervised-list', {
            userIdList: "[31,33,32]",
            userId:  supervisor2['id'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        Scripts.login('supervisor@opensupports.com', 'passwordOfSupervisor')
        result = request('/user/get-supervised-tickets', {
            supervisedUsers: "[31,33,32]",
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
        Scripts.logout()
        
        Scripts.login('supervisor2@opensupports.com', 'usersupervised2')
        result = request('/user/get-supervised-tickets', {
            supervisedUsers: "[31,33,32]",
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
        Scripts.logout()
    
    end

    it 'should if supervised Users tryes to handle supervisor-ticket' do
        Scripts.logout()
        Scripts.login('usersupervised1@opensupports.com', 'usersupervised1')
        
        result = request('/user/get-supervised-tickets', {
            supervisedUsers: "[30]",
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_SUPERVISED_USERS')  

        Scripts.logout()
        Scripts.login('usersupervised2@opensupports.com', 'usersupervised2')
        
        result = request('/user/get-supervised-tickets', {
            supervisedUsers: "[30]",
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_SUPERVISED_USERS')  

        Scripts.logout()
        Scripts.login('usersupervised3@opensupports.com', 'usersupervised3')
        
        result = request('/user/get-supervised-tickets', {
            supervisedUsers: "[30]",
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_SUPERVISED_USERS')  

    end
end
