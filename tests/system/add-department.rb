describe'system/add-department' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should add department with alphanumeric characters' do
            result = request('/system/add-department', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: 'new department'
            })

            (result['status']).should.equal('success')

            row = $database.getRow('department', 4, 'id')

            (row['name']).should.equal('Tech support')
            (row['private']).should.equal(0)

            lastLog = $database.getLastRow('log')
            (lastLog['type']).should.equal('ADD_DEPARTMENT')
        end

        it 'should add department with html tag' do
            result = request('/system/add-department', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: '<b>new department</b>'
            })

            (result['status']).should.equal('success')

            row = $database.getRow('department', 6, 'id')

            (row['name']).should.equal('new department')
            (row['private']).should.equal(0)

            lastLog = $database.getLastRow('log')
            (lastLog['type']).should.equal('ADD_DEPARTMENT')
        end

        it 'should add a private department' do
            result = request('/system/add-department', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: 'a private department',
                private: 1
            })

            (result['status']).should.equal('success')

            row = $database.getRow('department', 'a private department', 'name')
            (row['private']).should.equal(1)

            lastLog = $database.getLastRow('log')
            (lastLog['type']).should.equal('ADD_DEPARTMENT')
        end
end
