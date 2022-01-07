describe '/staff/supervisor-user-list' do
    Scripts.logout()
    
    Scripts.createUser('supervisor@opensupports.com', 'passwordOfSupervisor', 'Supervisor Guy')
    Scripts.createUser('usersupervised1@opensupports.com', 'usersupervised1', 'supervised Guy1')
    Scripts.createUser('usersupervised2@opensupports.com', 'usersupervised2', 'supervised Guy2')
    Scripts.createUser('usersupervised3@opensupports.com', 'usersupervised3', 'supervised Guy3')
    
    Scripts.login('supervisor@opensupports.com', 'passwordOfSupervisor')
    Scripts.createTicket('titlecreateadbySUpervisor','contentoftitlecreateadbySUpervisor',1)
    Scripts.logout()

    Scripts.login('usersupervised1@opensupports.com', 'usersupervised1')
    Scripts.createTicket('titlecreateadbyusersupervised1','contentoftitlecreateadbyusersupervised1',3)
    Scripts.logout()

    Scripts.login('usersupervised2@opensupports.com', 'usersupervised2')
    Scripts.createTicket('titlecreateadbyusersupervised2','contentoftitlecreateadbyusersupervised2',1)
    Scripts.logout()

    Scripts.login('usersupervised3@opensupports.com', 'usersupervised3')
    Scripts.createTicket('titlecreateadbyusersupervised3','contentoftitlecreateadbyusersupervised3',1)
    Scripts.logout()

    supervisor = $database.getRow('user', 'supervisor@opensupports.com', 'email')
    user1 = $database.getRow('user', 'usersupervised1@opensupports.com', 'email')
    user2 = $database.getRow('user', 'usersupervised2@opensupports.com', 'email')
    user3 = $database.getRow('user', 'usersupervised3@opensupports.com', 'email')

    ticketsupervisor = $database.getRow('ticket', 'titlecreateadbySUpervisor', 'title')
    ticketuser1 = $database.getRow('ticket', 'titlecreateadbyusersupervised1', 'title')
    ticketuser2 = $database.getRow('ticket', 'titlecreateadbyusersupervised2', 'title')
    ticketuser3 = $database.getRow('ticket', 'titlecreateadbyusersupervised3', 'title')
    it'should fail if a no-staff tryes to make the request'do
        Scripts.logout()
        Scripts.login('supervisor@opensupports.com', 'passwordOfSupervisor')
        
        result = request('/user/edit-supervised-list', {
            userIdList: "[30,31,32]",
            userId: supervisor['id'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
        
    end

    it 'should fail if userIdList is wrong' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        
        result = request('/user/edit-supervised-list', {
            userIdList: "1",
            userId: supervisor['id'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_LIST')

        result = request('/user/edit-supervised-list', {
            userIdList: "array",
            userId: supervisor['id'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_LIST')

        result = request('/user/edit-supervised-list', {
            userIdList: "[30,31,32,666666]",
            userId: supervisor['id'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_LIST')
    end

    it'should fail if userId is wrong'do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        
        result = request('/user/edit-supervised-list', {
            userIdList: "[30,31,32]",
            userId:  666,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_USER')
    end

    it'should fail if supervisor is included in user-id-List'do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        
        result = request('/user/edit-supervised-list', {
            userIdList: "[30,31,29]",
            userId:  supervisor['id'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('SUPERVISOR_CAN_NOT_SUPERVISE_HIMSELF')
    end
    
    it'should create supervisor user'do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        
        result = request('/user/edit-supervised-list', {
            userIdList: "[31,32,33]",
            userId:  supervisor['id'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('success')
        
    end

    it 'should allow supervisor to access tickets from supervisated users' do
        Scripts.logout()
        Scripts.login('supervisor@opensupports.com', 'passwordOfSupervisor')
        result = request('/ticket/get', {
            ticketNumber: ticketsupervisor['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        result = request('/ticket/get', {
            ticketNumber: ticketuser1['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        result = request('/ticket/get', {
            ticketNumber: ticketuser2['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        result = request('/ticket/get', {
            ticketNumber: ticketuser3['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')
        
    end
    it 'should allow supervisor see only the new user list' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        
        request('/user/edit-supervised-list', {
            userIdList: "[31]",
            userId:  supervisor['id'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        

        Scripts.logout()
        Scripts.login('supervisor@opensupports.com', 'passwordOfSupervisor')

        result = request('/ticket/get', {
            ticketNumber: ticketsupervisor['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        result = request('/ticket/get', {
            ticketNumber: ticketuser1['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        result = request('/ticket/get', {
            ticketNumber: ticketuser2['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('fail')

        result = request('/ticket/get', {
            ticketNumber: ticketuser3['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('fail')
    end
end
