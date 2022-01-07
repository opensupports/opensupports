describe'/staff/delete' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)
    @staffId = $database.getRow('staff','littlelannister@opensupports.com','email')['id']

    it 'should delete staff member' do
        result= request('/staff/delete', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            staffId: @staffId
        })

        (result['status']).should.equal('success')

        row = $database.getRow('staff', @staffId, 'id')
        (row).should.equal(nil)

        row = $database.getRow('department', 1, 'id')
        (row['owners']).should.equal(6)

    end

    it 'should fail delete if staff member is does not exist' do
        result = request('/staff/delete', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            staffId: @staffId
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_STAFF')

        row = $database.getRow('department', 1, 'id')
        (row['owners']).should.equal(6)
    end
end
