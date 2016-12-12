describe'system/edit-department' do
        request('/user/logout')
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
        end
end