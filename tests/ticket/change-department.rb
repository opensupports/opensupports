describe '/ticket/change-department' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    #TODO: Create tests

    it 'should change department if everything is okey' do
        ticket = $database.getRow('ticket', 1 , 'id')

        result = request('/ticket/change-department', {
            ticketNumber: ticket['ticket_number'],
            departmentId: 2,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 1 , 'id')
        (ticket['department_id']).should.equal('2')
    end
end