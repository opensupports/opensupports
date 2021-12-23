describe'system/edit-department' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should edit department' do
            result= request('/system/edit-department', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: 'second name',
                departmentId: 4
            })

            (result['status']).should.equal('success')

            row = $database.getRow('department', 4, 'id')

            (row['name']).should.equal('second name')

            lastLog = $database.getLastRow('log')
            (lastLog['type']).should.equal('EDIT_DEPARTMENT')
        end

        it 'should fail if name is invalid' do
            result = request('/system/edit-department', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: '',
                departmentId: 4
            })
            result['status'].should.equal('fail')
            result['message'].should.equal('INVALID_NAME')

            long_name = ''
            201.times {long_name << 'A'}

            result = request('/system/edit-department', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: long_name,
                departmentId: 4
            })

            
            result['status'].should.equal('fail')
            result['message'].should.equal('INVALID_NAME')

        end

        it 'should success if you change for the same name' do
            Scripts.createDepartment('thisisAnewName')

            department = $database.getLastRow('department')
            (department['private']).should.equal(0)

            
            result = request('/system/edit-department', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: department['name'],
                departmentId: department['id'],
                private:1
            })

            row = $database.getRow('department', 'thisisAnewName', 'name')
            (row['private']).should.equal(1)

            result['status'].should.equal('success')
            
        end

        it 'shouild fail if you use an used name' do
            Scripts.createDepartment('thistitleisunique')
            
            lastDepartment = $database.getLastRow('department')

            result = request('/system/edit-department', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: 'thisisAnewName',
                departmentId: lastDepartment['id'],
                private:1
            })

            result['status'].should.equal('fail')
            result['message'].should.equal('NAME_ALREADY_USED')
        end

end
