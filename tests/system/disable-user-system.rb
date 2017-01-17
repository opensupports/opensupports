describe'system/disable-user-system' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should disable the user system' do
            result = request('/system/disable-user-system', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                password:$staff[:password]
            })

            puts result['message']
            (result['status']).should.equal('success')

            row = $database.getRow('setting', 'user-system-enabled', 'name')

            (row['value']).should.equal('0')
            row = $database.getRow('user', 1, 'id')
            (row).should.equal(nil)

            numberOftickets= $database.query("SELECT * FROM ticket WHERE author_id IS NULL AND author_email IS NOT NULL AND author_name IS NOT NULL")

            (numberOftickets.num_rows).should.equal(35)

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

        it 'should enabled the user system' do
            result = request('/system/enabled-user-system', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                password:$staff[:password]
            })

            puts result['message']
            (result['status']).should.equal('success')

            row = $database.getRow('setting', 'user-system-enabled', 'name')
            (row['value']).should.equal('1')

            numberOftickets= $database.query("SELECT * FROM ticket WHERE author_email IS NULL AND author_name IS NULL AND author_id IS NOT NULL"  )

            (numberOftickets.num_rows).should.equal(35)

        end

        it 'should not enabled the user system' do
            result = request('/system/enabled-user-system', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                password:$staff[:password]
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('SYSTEM_USER_IS_ALREADY_ENABLED')

        end
end
