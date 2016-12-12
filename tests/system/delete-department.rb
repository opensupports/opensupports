describe'system/delete-department' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should delete department' do
            result= request('/system/delete-department', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                departmentId: 4
            })

            (result['status']).should.equal('success')

            row = $database.getRow('department', 4, 'id')

            (row).should.equal(nil)
        end
end