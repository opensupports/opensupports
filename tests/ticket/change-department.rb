describe '/ticket/change-department' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    request('/system/add-department', {
        csrf_userid: $csrf_userid,
        csrf_token: $csrf_token,
        name: 'Suggestions'
    })
    request('/system/add-department', {
        csrf_userid: $csrf_userid,
        csrf_token: $csrf_token,
        name: 'Tech support'
    })
    request('/staff/edit', {
        csrf_userid: $csrf_userid,
        csrf_token: $csrf_token,
        departments: '[1, 2, 3]',
        staffId: 1
    })

    it 'should change department if everything is okey' do
        ticket = $database.getRow('ticket', 1 , 'id')
        request('/staff/assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        result = request('/ticket/change-department', {
            ticketNumber: ticket['ticket_number'],
            departmentId: 3,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 1 , 'id')
        (ticket['unread']).should.equal('1')
        (ticket['department_id']).should.equal('3')
        (ticket['owner_id']).should.equal('1')

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('DEPARTMENT_CHANGED')
    end

end
