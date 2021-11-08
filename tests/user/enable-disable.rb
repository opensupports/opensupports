describe 'Enable/disable user' do
    user = $database.getRow('user', 'login@os4.com', 'email')

    describe '/user/disable' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should disable user' do
            result = request('/user/disable', {
                userId: user['id'],
                csrf_token: $csrf_token,
                csrf_userid: $csrf_userid,
            })

            (result['status']).should.equal('success')
        end

        it 'should not disable user if already disabled' do
            result = request('/user/disable', {
                userId: user['id'],
                csrf_token: $csrf_token,
                csrf_userid: $csrf_userid,
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('ALREADY_DISABLED')
        end

        it 'should reject login' do
            Scripts.logout()
            result = request('/user/login', {
                email: 'login@os4.com',
                password: 'loginpass'
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('USER_DISABLED')
        end
    end

    describe '/user/enable' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should enable user' do
            result = request('/user/enable', {
                userId: user['id'],
                csrf_token: $csrf_token,
                csrf_userid: $csrf_userid,
            })

            (result['status']).should.equal('success')
        end

        it 'should not enable user if already enabled' do
            result = request('/user/enable', {
                userId: user['id'],
                csrf_token: $csrf_token,
                csrf_userid: $csrf_userid,
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('ALREADY_ENABLED')

            result = request('/user/enable', {
                userId: 1,
                csrf_token: $csrf_token,
                csrf_userid: $csrf_userid,
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('ALREADY_ENABLED')
        end
    end
end
