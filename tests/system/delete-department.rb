describe 'system/delete-department' do
        Scripts.logout()
        Scripts.createUser('tranferguy@opensupports.com', 'transfer', 'Transfer Guy')
        Scripts.login('tranferguy@opensupports.com', 'transfer')
        $apikey = $database.getRow('apikey',1,'id')
        
        ticket1 = request('/ticket/create',{
            title: 'Transferible ticket 1',
            content: 'The north remembers',
            departmentId: 4,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            apiKey: $apikey['token']
        })
        ticket2 =request('/ticket/create',{
            title: 'Transferible ticket 2',
            content: 'The north remembers',
            departmentId: 4,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            apiKey: $apikey['token']
        })
        ticket3 = request('/ticket/create',{
            title: 'Transferible ticket 3',
            content: 'The north remembers',
            departmentId: 4,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            apiKey: $apikey['token']
        })
        ticket1 = ticket1['data']['ticketNumber']
        ticket2 = ticket2['data']['ticketNumber']
        ticket3 = ticket3['data']['ticketNumber']

        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1, 2, 3, 4]'
        })
        request('/staff/assign-ticket', {
            ticketNumber: ticket3,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        it 'should fail if departments are the same' do
            result = request('/system/delete-department', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                departmentId: 4,
                transferDepartmentId: 4
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('SAME_DEPARTMENT')
        end

        it 'should fail if department to transfer is private' do
            result = request('/system/delete-department', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                departmentId: 4,
                transferDepartmentId: 2
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('DEPARTMENT_PRIVATE_TICKETS')
        end

        it 'should delete department' do
            result = request('/system/delete-department', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                departmentId: 4,
                transferDepartmentId: 3
            })

            (result['status']).should.equal('success')

            row = $database.getRow('department', 4, 'id')
            (row).should.equal(nil)

            ticket1 = $database.getRow('ticket', ticket1, 'ticket_number')
            ticket2 = $database.getRow('ticket', ticket2, 'ticket_number')
            ticket3 = $database.getRow('ticket', ticket3, 'ticket_number')

            (ticket1['department_id']).should.equal(3)
            (ticket1['owner_id']).should.equal(nil)

            (ticket2['department_id']).should.equal(3)
            (ticket2['owner_id']).should.equal(nil)

            (ticket3['department_id']).should.equal(3)
            (ticket3['owner_id']).should.equal($csrf_userid.to_i)

            lastLog = $database.getLastRow('log')
            (lastLog['type']).should.equal('DELETE_DEPARTMENT')
        end
end
