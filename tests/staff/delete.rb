describe'/staff/delete' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should delete staff member' do
        result= request('/staff/delete', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            staffId:2
        })

        (result['status']).should.equal('success')

        row = $database.getRow('staff', 2, 'id')
        (row).should.equal(nil)

        row = $database.getRow('department', 1, 'id')
        (row['owners']).should.equal('2')

    end
    it 'should fail delete if staff member is does not exist' do
        result= request('/staff/delete', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            staffId:2
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_STAFF')

        row = $database.getRow('department', 1, 'id')
        (row['owners']).should.equal('2')
    end
end