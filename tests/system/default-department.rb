describe '/system/default-department' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)
    
    it 'should fail if try to turn a private department default' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        privatedepartment = $database.getRow('department', 1, 'private')

        result = request('/system/edit-settings', {
            "csrf_userid" => $csrf_userid,
            "csrf_token" => $csrf_token,
            "default-department-id" => privatedepartment['id'] 
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_DEFAULT_DEPARTMENT')
    end

    it 'should edit locked setting' do
        result = request('/system/edit-settings', {
            "csrf_userid" => $csrf_userid,
            "csrf_token" => $csrf_token,
            "default-is-locked" => 1
        })

        (result['status']).should.equal('success')
        
        row = $database.getRow('setting', 'default-is-locked', 'name')
        (row['value']).should.equal('1')
    end
    
    it 'should fail if default-department-id does not exist' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        result= request('/system/edit-settings', {
            "csrf_userid" => $csrf_userid,
            "csrf_token" => $csrf_token,
            "default-department-id" =>  1111
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_DEFAULT_DEPARTMENT')
    end

    it 'should set a new default deparment' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        publicdepartment = $database.getRow('department', 'Suggestions', 'name')

        result = request('/system/edit-settings', {
            "csrf_userid" => $csrf_userid,
            "csrf_token" => $csrf_token,
            "default-department-id" => publicdepartment['id'] 
        })

        (result['status']).should.equal('success')
    end

    it 'should fail if try to delete the default department' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        defaultDepartment  = $database.getRow('setting', 'default-department-id', 'name')
        transferDepartment = $database.getRow('department','<b>new department</b>','name')
        
        result = request('/system/delete-department', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departmentId: defaultDepartment['value'],
            transferDepartmentId: transferDepartment['id']
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('CAN_NOT_DELETE_DEFAULT_DEPARTMENT')
    end
    
    it 'should fail if try to edit default department into private' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        defaultDepartmentId = $database.getRow('setting', 'default-department-id', 'name')
        department = $database.getRow('department',defaultDepartmentId['value'],'id')
        
        result = request('/system/edit-department', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departmentId: department['id'],
            name: 'thisIsAdiferentName',
            private: true
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('DEFAULT_DEPARTMENT_CAN_NOT_BE_PRIVATE')
    end

    it 'should create ticket in default department if Staff does not give department with locked on' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        Scripts.updateLockedDepartmentSetting(1)
        
        result = request('/ticket/create', {
            title: 'Night King',
            content: 'Arya sucks',
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        row = $database.getRow('ticket', 'Night King', 'title')
        
        setting = $database.getRow('setting', 'default-department-id','name')
        (row['department_id']).should.equal(setting['value'].to_i)
        
    end

    it 'should create ticket in default department if staff does not give department with locked off'do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        Scripts.updateLockedDepartmentSetting(0)
        
        result = request('/ticket/create', {
            title: 'Night King2',
            content: 'Arya sucks2',
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        row = $database.getRow('ticket', 'Night King2', 'title')
        
        setting = $database.getRow('setting', 'default-department-id','name')
        (row['department_id']).should.equal(setting['value'].to_i)
    end

    it 'should create ticket in selected department if staff give department and lockd is off'do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        Scripts.updateLockedDepartmentSetting(0)
        
        result = request('/ticket/create', {
            title: 'Night King3',
            content: 'Arya sucks3',
            language: 'en',
            departmentId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        row = $database.getRow('ticket', 'Night King3', 'title')
        
        (row['department_id']).should.equal(1)
    end
        
    it 'should create ticket in selected department if staff give department and locked is on' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        Scripts.updateLockedDepartmentSetting(1)
        
        result = request('/ticket/create', {
            title: 'Night King4',
            content: 'Arya sucks4',
            language: 'en',
            departmentId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        row = $database.getRow('ticket', 'Night King4', 'title')
        
        (row['department_id']).should.equal(1)
    end
        
    it 'should create ticket on default department if user does not give department and locked is on' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        Scripts.updateLockedDepartmentSetting(1)
        
        Scripts.logout()
        Scripts.login('user@os4.com', 'loginpass')
        
        result = request('/ticket/create', {
            title: 'Night King5',
            content: 'Arya sucks5',
            language: 'en',
            departmentId: 5,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')
        
        row = $database.getRow('ticket', 'Night King5', 'title')
        setting = $database.getRow('setting', 'default-department-id','name')
        
        (row['department_id']).should.equal(setting['value'].to_i) 
    end

    it 'should create ticket on default department if user does not give department and locked is off'do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        Scripts.updateLockedDepartmentSetting(0)

        Scripts.logout()
        Scripts.login('user@os4.com', 'loginpass')
        
        result = request('/ticket/create', {
        title: 'Night King6',
        content: 'Arya sucks6',
        language: 'en',
        csrf_userid: $csrf_userid,
        csrf_token: $csrf_token
        })
        
        row = $database.getRow('ticket', 'Night King6', 'title')
        setting = $database.getRow('setting', 'default-department-id','name')
        
        (row['department_id']).should.equal(setting['value'].to_i)
    end
        
    it 'should create ticket on selected department if user give department and locked is off'do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        Scripts.updateLockedDepartmentSetting(0)

        Scripts.logout()
        Scripts.login('user@os4.com', 'loginpass')
        
        result = request('/ticket/create', {
        title: 'Night King16',
        content: 'Arya sucks16',
        language: 'en',
        departmentId: 1,
        csrf_userid: $csrf_userid,
        csrf_token: $csrf_token
        })
        
        row = $database.getRow('ticket', 'Night King16', 'title')
        
        (row['department_id']).should.equal(1)
    end

    it 'should create ticket on default language if user does not pass language'do
        $database.query('update setting set value="ru" where name="language";')
        
        Scripts.logout()
        Scripts.login('user@os4.com', 'loginpass')

        result = request('/ticket/create', {
            title: 'Danny Dragon',
            content: 'They do not get to choose',
            departmentId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        ticket = $database.getRow('ticket', 'Danny Dragon', 'title')
        defaultLanguage = $database.getRow('setting', 'language', 'name') 
        
        
        (ticket['language']).should.equal(defaultLanguage['value'])
        result['status'].should.equal('success')
        
        $database.query('update setting set value="en" where name="language";')
    end
end