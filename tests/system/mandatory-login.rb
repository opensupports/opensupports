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

        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        
        it 'should fail trying to disable mandatory login when registration is off' do
            request('/system/disable-registration', {
                "csrf_userid" => $csrf_userid,
                "csrf_token" => $csrf_token,
                "password" => $staff[:password]
            })
            result = request('/system/disable-mandatory-login', {
                "csrf_userid" => $csrf_userid,
                "csrf_token" => $csrf_token,
                "password" => $staff[:password]
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('REGISTRATION_IS_DESACTIVATED')
            row = $database.getRow('setting', 'mandatory-login', 'name')

            (row['value']).should.equal('1') 

            request('/system/enable-registration', {
                "csrf_userid" => $csrf_userid,
                "csrf_token" => $csrf_token,
                "password" => $staff[:password]
            })
        end 

        it 'should disable the mandatory login' do
            result = request('/system/disable-mandatory-login', {
                "csrf_userid" => $csrf_userid,
                "csrf_token" => $csrf_token,
                "password" => "invalidPassword"
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_PASSWORD')

            row = $database.getRow('setting', 'mandatory-login', 'name')

            (row['value']).should.equal('1') 

            result = request('/system/disable-mandatory-login', {
                "csrf_userid" => $csrf_userid,
                "csrf_token" => $csrf_token,
                "password" => $staff[:password]
            })

            (result['status']).should.equal('success')

            row = $database.getRow('setting', 'mandatory-login', 'name')

            (row['value']).should.equal('0') 
        end

        it 'should fail trying to disable registration if mandatory login is false' do
            result = request('/system/disable-registration', {
                "csrf_userid" => $csrf_userid,
                "csrf_token" => $csrf_token,
                "password" => $staff[:password]
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('MANDATORY_LOGIN_IS_DESACTIVATED')
            row = $database.getRow('setting', 'registration', 'name')

            (row['value']).should.equal('1') 
        end
        it 'should allow Staff invite Users when Mandatory-login is off' do
            result = request('/user/invite', {
                "csrf_userid" => $csrf_userid,
                "csrf_token" => $csrf_token,
                email: 'inviteduser@opensupports.com',
                name: 'inviteduser'
            })
            (result['status']).should.equal('success')
            (result['data']['userEmail']).should.equal('inviteduser@opensupports.com')
           
            $row =  $database.getRow('recoverpassword','inviteduser@opensupports.com','email')
            ($row['email']).should.equal('inviteduser@opensupports.com')

        end
        
        it 'should allow a creator creates a ticket and create him a user' do
            Scripts.logout()
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
            ($userRow['email']).should.equal('nonuser@os4.com')
            ($userRow['not_registered']).should.equal(1)
            ($userRow['tickets']).should.equal(1)
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
            ($userRow['email']).should.equal('nonuser@os4.com')
            ($userRow['tickets']).should.equal(2)

        end

        it 'should fail if a creator check others ticket' do
            $ticketRow = $database.getRow('ticket','Should we pay?','title')

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
            (result['data']['userId']).should.equal($userRow['id'].to_s)
            (result['data']['ticketNumber']).should.equal($ticketRow['ticket_number'].to_s)
            
            $sessionToken = result['data']['token']
            $sessionId = result['data']['userId']
            $sessionTicketNumber = result['data']['ticketNumber']
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

            result = request('/ticket/edit-comment', {
                csrf_token: $sessionToken,
                csrf_userid: $sessionId,
                ticketNumber:  $sessionTicketNumber,
                ticketEventId: 0,
                content: 'this is the first edited-comment without login'
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

            result = request('/ticket/close', {
                csrf_token: $sessionToken,
                csrf_userid: $sessionId,
                ticketNumber:  $sessionTicketNumber,
            })
            (result['status']).should.equal('success')

            $ticketRow = $database.getRow('ticket','new title of ticket created without login','title')
            
            ($ticketRow['title']).should.equal('new title of ticket created without login')
            ($ticketRow['content']).should.equal('this is the first edited-comment without login')
            ($ticketRow['closed']).should.equal(1)
            
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

        it 'should re-login if the creator tries to check another ticket with a existent session' do
            $ticketRow = $database.getRow('ticket','ticket2 created without login','title')
            
            result = request('/ticket/check', {
                email: 'nonuser@os4.com',
                ticketNumber: $ticketRow['ticket_number']
            })

            (result['status']).should.equal('success')
        end  

        it 'should fail if  the creator tries to login with email used to create tickets' do
            result = request('/user/login', {
                email: 'nonuser@os4.com'
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_CREDENTIALS')

            Scripts.logout()

            result = request('/user/login', {
                email: 'nonuser@os4.com'
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_CREDENTIALS')
        end
        
        it 'should allow the creator sign up' do
            Scripts.logout()
            Scripts.createUser('nonuser@os4.com', 'customPassword', 'nonuser')
            $userRow = $database.getRow('user','nonuser@os4.com','email')
            ($userRow['never_logged']).should.equal(nil)
            ($userRow['verification_token']).should.equal(nil)
        end

        it 'should allow the creator login and get more than 1 own ticket' do
            Scripts.logout()
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
                csrf_userid: $sessionUserId,
                csrf_token: $sessionToken,
                ticketNumber: $ticket3['ticket_number'],
            })
            (result['status']).should.equal('success')
            
            result = request('/ticket/get', {
                csrf_userid: $sessionUserId,
                csrf_token: $sessionToken,
                ticketNumber: $ticket2['ticket_number'],
            })
            (result['status']).should.equal('success')
        end

        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should allow staff enable the mandatory login' do
            result = request('/system/enable-mandatory-login', {
                "csrf_userid" => $csrf_userid,
                "csrf_token" => $csrf_token,
                "password" => "invalidPassword"
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_PASSWORD')

            row = $database.getRow('setting', 'mandatory-login', 'name')

            (row['value']).should.equal('0') 

            result = request('/system/enable-mandatory-login', {
                "csrf_userid" => $csrf_userid,
                "csrf_token" => $csrf_token,
                "password" => $staff[:password]
            })

            (result['status']).should.equal('success')

            row = $database.getRow('setting', 'mandatory-login', 'name')

            (row['value']).should.equal('1') 
        end
end
