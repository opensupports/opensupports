describe'system/mandatory-login' do
        
        it 'should fail if a creator tries to create a ticket without login' do
            
            result = request('/ticket/create', {
                email: 'nonuser@os4.com',
                language: 'en',
                name: 'nonuser',
                title: 'ticket created without login',
                content: 'THis is the first content created without login',
                departmentId: 1   
            })
            (result['status']).should.equal('fail')
            (result['message']).should.equal('NO_PERMISSION')
        end

        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should disable the mandatory login' do
            result = request('/system/edit-settings', {
                "csrf_userid" => $csrf_userid,
                "csrf_token" => $csrf_token,
                "mandatory-login" => 0
            })

            (result['status']).should.equal('success')

            row = $database.getRow('setting', 'mandatory-login', 'name')

            (row['value']).should.equal('0') 
        end

        it 'should fail trying to disable registration' do
            result = request('/system/disable-registration', {
                "csrf_userid" => $csrf_userid,
                "csrf_token" => $csrf_token,
                "password" => "staff"
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('MANDATORY_LOGIN_IS_DESACTIVATED')
            row = $database.getRow('setting', 'registration', 'name')

            (row['value']).should.equal('1') 
        end
        
        
        it 'should allow a creator creates a ticket and create him a user' do
            request('/user/logout')
            result = request('/ticket/create', {
                email: 'nonuser@os4.com',
                language: 'en',
                name: 'nonuser',
                title: 'ticket created without login',
                content: 'THis is a content created without login',
                departmentId: 1   
            })
            $ticketRow = $database.getRow('ticket','ticket created without login','title')
            $userRow = $database.getRow('user','nonuser@os4.com','email')

            (result['status']).should.equal('success')
            (result['data']['ticketNumber']).should.equal($ticketRow['ticket_number'].to_i)
            ($userRow['email']).should.equal('nonuser@os4.com')
            ($userRow['never_logged']).should.equal('1')
            ($userRow['tickets']).should.equal('1')
        end

        it 'should allow the creator creates another ticket and not create another user' do
            result = request('/ticket/create', {
                email: 'nonuser@os4.com',
                language: 'en',
                name: 'nonuser',
                title: 'ticket2 created without login',
                content: 'THis is the second content created without login',
                departmentId: 1   
            })

            $ticketRow = $database.getRow('ticket','ticket2 created without login','title')
            $userRow = $database.getRow('user','nonuser@os4.com','email')

            (result['status']).should.equal('success')
            (result['data']['ticketNumber']).should.equal($ticketRow['ticket_number'].to_i)
            ($userRow['email']).should.equal('nonuser@os4.com')
            ($userRow['tickets']).should.equal('2')

        end

        it 'should fail if a creator check others ticket' do
            $ticketRow = $database.getRow('ticket',1,'id')

            result = request('/ticket/check', {
                email: 'nonuser@os4.com',
                ticketNumber: $ticketRow['ticket_number']   
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('NO_PERMISSION')
        end

        it 'should fail if a creator tries to check an inexistant ticket' do
            
            result = request('/ticket/check', {
                email: 'nonuser@os4.com',
                ticketNumber: 111111   
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_TICKET')
        end

        it 'should allow a creator check a own ticket' do
            $ticketRow = $database.getRow('ticket','ticket created without login','title')
            $userRow = $database.getRow('user','nonuser@os4.com','email')

            result = request('/ticket/check', {
                email: 'nonuser@os4.com',
                ticketNumber: $ticketRow['ticket_number']   
            })

            (result['status']).should.equal('success')
            (result['data']['userID']).should.equal($userRow['id'])
            (result['data']['ticketNumber']).should.equal($ticketRow['ticket_number'])
            
            $sessionToken = result['data']['token']
            $sessionId = result['data']['userID']
            $sessionTicketNumber = result['data']['ticketNumber']
        end

        it 'should fail if the creator creates a ticket using  a diferent email of the session' do
            result = request('/ticket/create', {
                email: 'nonuser2@os4.com',
                language: 'en',
                name: 'nonuser2',
                title: 'ticket3 created without login',
                content: 'THis is the third content created without login',
                departmentId: 1   
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_EMAIL')
        end

        it 'should allow the creator get the ticket checked' do
            result = request('/ticket/get', {
                csrf_token: $sessionToken,
                csrf_userid: $sessionId,
                ticketNumber:  $sessionTicketNumber
            })
            (result['status']).should.equal('success')
            (result['data']['title']).should.equal($ticketRow['title'])
            (result['data']['content']).should.equal($ticketRow['content'])
        end

        it 'should allow the creator handle the ticket checked' do

            result = request('/ticket/edit-title', {
                csrf_token: $sessionToken,
                csrf_userid: $sessionId,
                ticketNumber:  $sessionTicketNumber,
                title: 'new title of ticket created without login'
            })
            (result['status']).should.equal('success')

            result = request('/ticket/edit-comment', {
                csrf_token: $sessionToken,
                csrf_userid: $sessionId,
                ticketNumber:  $sessionTicketNumber,
                content: 'this is the new content of the ticket created without login'
            })
            (result['status']).should.equal('success')

            result = request('/ticket/comment', {
                csrf_token: $sessionToken,
                csrf_userid: $sessionId,
                ticketNumber:  $sessionTicketNumber,
                content: 'this is the first comment without login'
            })
            (result['status']).should.equal('success')

            result = request('/ticket/comment', {
                csrf_token: $sessionToken,
                csrf_userid: $sessionId,
                ticketNumber:  $sessionTicketNumber,
                content: 'this is the second comment without login'
            })
            (result['status']).should.equal('success')

            result = request('/ticket/edit-comment', {
                csrf_token: $sessionToken,
                csrf_userid: $sessionId,
                ticketNumber:  $sessionTicketNumber,
                ticketEventId: 0,
                content: 'this is the first edited-comment without login'
            })
            (result['status']).should.equal('success')

            result = request('/ticket/close', {
                csrf_token: $sessionToken,
                csrf_userid: $sessionId,
                ticketNumber:  $sessionTicketNumber,
            })
            (result['status']).should.equal('success')

            $ticketRow = $database.getRow('ticket','new title of ticket created without login','title')
            
            ($ticketRow['title']).should.equal('new title of ticket created without login')
            ($ticketRow['content']).should.equal('this is the first edited-comment without login')
            ($ticketRow['closed']).should.equal('1')
            
            result = request('/ticket/delete', {
                csrf_token: $sessionToken,
                csrf_userid: $sessionId,
                ticketNumber:  $sessionTicketNumber,
            })
            (result['status']).should.equal('success')

        end

        it 'should fail if the creator tries to get a own ticket not checked' do
            $ticketRow = $database.getRow('ticket','ticket2 created without login','title')
            
            result = request('/ticket/get', {
                csrf_token: $sessionToken,
                csrf_userid: $sessionId,
                ticketNumber:  $ticketRow['ticket_number'],
            })
            (result['status']).should.equal('fail')
            (result['message']).should.equal('NO_PERMISSION')
        end

        it 'should fail if  the creator tries to check another ticket with a existent session' do

            $ticketRow = $database.getRow('ticket','ticket2 created without login','title')
            
            result = request('/ticket/check', {
                email: 'nonuser@os4.com',
                ticketNumber: $ticketRow['ticket_number']
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('SESSION_EXISTS')

        end  
        it 'should fail if  the creator tries to login with email used to create tickets' do
            result = request('/user/login', {
                email: 'nonuser@os4.com'
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('SESSION_EXISTS')

            request('/user/logout')

            result = request('/user/login', {
                email: 'nonuser@os4.com'
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_CREDENTIALS')
        end
        
        it 'should allow the creator sign up' do
            request('/user/logout')
            Scripts.createUser('nonuser@os4.com', 'customPassword', 'nonuser')
            $userRow = $database.getRow('user','nonuser@os4.com','email')
            ($userRow['never_logged']).should.equal(nil)
            ($userRow['verification_token']).should.equal(nil)
        end

        it 'should allow the creator login and get more than 1 own ticket' do
            request('/user/logout')
            result = request('/user/login', {
                email: 'nonuser@os4.com',
                password: 'customPassword'
            })
            (result['status']).should.equal('success')

            $sessionToken = result['data']['token']
            $sessionUserId = result['data']['userId']

            result = request('/ticket/create', {
                title: 'Valid titlee',
                content: 'ticket created to see ifcreator can handle 2 tickets',
                departmentId: 1,
                language: 'en',
                csrf_userid: $sessionUserId,
                csrf_token: $sessionToken
            })
            $ticket2 = $database.getRow('ticket', 'ticket2 created without login', 'title')
            $ticket3 = $database.getRow('ticket', 'ticket created to see ifcreator can handle 2 tickets', 'content')
            
            result = request('/ticket/get', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                ticketNumber: $ticket3['ticket_number'],
            })
            (result['status']).should.equal('success')
            
            result = request('/ticket/get', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                ticketNumber: $ticket2['ticket_number'],
            })
            (result['status']).should.equal('success')
        end
end
