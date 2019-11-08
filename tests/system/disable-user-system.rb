describe'system/disable-user-system' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should disable the user system' do
            result = request('/system/disable-user-system', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                password:$staff[:password]
            })

            (result['status']).should.equal('success')

            row = $database.getRow('setting', 'user-system-enabled', 'name')

            (row['value']).should.equal('0')
            row = $database.getRow('user', 1, 'id')
            (row).should.equal(nil)

            numberOftickets= $database.query("SELECT * FROM ticket WHERE author_id IS NULL AND author_email IS NOT NULL AND author_name IS NOT NULL")

            (numberOftickets.num_rows).should.equal(51)

            request('/user/logout')

            result = request('/user/signup', {
                :name => 'test name',
                :email => 'steve@mail.com',
                :password => 'customm'
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('USER_SYSTEM_DISABLED')

            result = request('/user/login', {
                email: @loginEmail,
                password: @loginPass
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('USER_SYSTEM_DISABLED')
        end

        it 'should create a ticket without user' do
            request('/user/logout')
            result = request('/ticket/create', {
                title: 'test ticket without user',
                content: 'The north remembers',
                departmentId: 1,
                language: 'en',
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_EMAIL')

            result = request('/ticket/create', {
                title: 'test ticket without user',
                content: 'The north remembers',
                departmentId: 1,
                language: 'en',
                name: 'Test Subject',
                email: 'emailtest@opensupports.com'
            })

            (result['status']).should.equal('success')
        end

        it 'should be able to comment on ticket as a non-logged user' do
            result = request('/ticket/create', {
                title: 'Doubt about Russian language',
                content: 'Stariy means old in Russian?',
                departmentId: 1,
                language: 'en',
                name: 'Abraham Einstein',
                email: 'abrahameinstein@opensupports.com'
            })
            (result['status']).should.equal('success')

            ticketNumber = result['data']['ticketNumber']

            result = request('/ticket/check', {
                ticketNumber: ticketNumber,
                email: 'abrahameinstein@opensupports.com',
                captcha: 'valid'
            })
            token = result['data']['token']
            (result['status']).should.equal('success');

            result = request('/ticket/comment', {
                content: 'I actually think it is not like that, but anyways, thanks',
                ticketNumber: ticketNumber,
                csrf_token: token
            })
            (result['status']).should.equal('success')
        end

        it 'should be able to assign and respond tickets' do
            Scripts.login($staff[:email], $staff[:password], true);
            ticket = $database.getLastRow('ticket');
            result = request('/staff/assign-ticket', {
                ticketNumber: ticket['ticket_number'],
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
            })
            (result['status']).should.equal('success')

            result = request('/ticket/comment', {
                ticketNumber: ticket['ticket_number'],
                content: 'This is a staff response for a ticket without an user',
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
            })
            (result['status']).should.equal('success')
        end

        it 'should be able to get the latest events as admin' do
            result = request('/staff/last-events', {
                page: 1,
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })
            (result['status']).should.equal('success')
            (result['data'].size).should.equal(10)
        end
        
        it 'should be able to get system logs as admin' do
            result = request('/system/get-logs', {
                page: 1,
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })
            (result['status']).should.equal('success')
            (result['data'].size).should.equal(10)
        end

        it 'should be be able to create a ticket as an admin' do
            result = request('/ticket/create', {
                title: 'created by staff with user system disabled',
                content: 'an staff created this ticket while user system disabled',
                departmentId: 1,
                language: 'en',
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })
            (result['status']).should.equal('success')
            ticket = $database.getRow('ticket', result['data']['ticketNumber'], 'ticket_number')
            (ticket['author_id']).should.equal(nil)
            (ticket['author_staff_id']).should.equal('1')
        end

        it 'should not disable the user system if it is already disabled 'do
            request('/user/logout')
            Scripts.login($staff[:email], $staff[:password], true)

            result = request('/system/disable-user-system', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                password:$staff[:password]
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('SYSTEM_USER_IS_ALREADY_DISABLED')
        end

        it 'should enable the user system' do
            result = request('/system/enable-user-system', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                password:$staff[:password]
            })

            (result['status']).should.equal('success')

            row = $database.getRow('setting', 'user-system-enabled', 'name')
            (row['value']).should.equal('1')

            numberOftickets= $database.query("SELECT * FROM ticket WHERE author_email IS NULL AND author_name IS NULL AND author_id IS NOT NULL"  )

            (numberOftickets.num_rows).should.equal(53)
        end

        it 'should not enable the user system' do
            result = request('/system/enable-user-system', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                password:$staff[:password]
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('SYSTEM_USER_IS_ALREADY_ENABLED')
        end
end
