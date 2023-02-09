describe '/ticket/change-department' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    Scripts.createTicket('Stafftitle','This ticket was made by an staff',1)
    Scripts.logout()

    Scripts.logout()
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
    request('/system/add-department', {
        csrf_userid: $csrf_userid,
        csrf_token: $csrf_token,
        name: 'Instalation problems'
    })
    request('/staff/edit', {
        csrf_userid: $csrf_userid,
        csrf_token: $csrf_token,
        departments: '[1, 2, 3]',
        staffId: 1
    })

    it 'should change department if staff has same department as ticket' do

        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        ticket = $database.getRow('ticket', 'Should we pay?', 'title')

        result = request('/ticket/change-department', {
            ticketNumber: ticket['ticket_number'],
            departmentId: 4,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'Should we pay?', 'title')
        (ticket['unread']).should.equal(1)
        (ticket['department_id']).should.equal(4)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('DEPARTMENT_CHANGED')
    end

    it 'should unassing ticket if staff does not server new department' do

          ticket = $database.getRow('ticket', 'Should we pay?', 'title')
          Scripts.assignTicket(ticket['ticket_number'])
          request('/staff/edit', {
              csrf_userid: $csrf_userid,
              csrf_token: $csrf_token,
              departments: '[2, 4]',
              staffId: 1
          })

          result = request('/ticket/change-department', {
              ticketNumber: ticket['ticket_number'],
              departmentId: 3,
              csrf_userid: $csrf_userid,
              csrf_token: $csrf_token
          })

          (result['status']).should.equal('success')

          ticket = $database.getRow('ticket', 'Should we pay?', 'title')
          (ticket['unread']).should.equal(1)
          (ticket['department_id']).should.equal(3)
          (ticket['owner_id']).should.equal(nil)

          lastLog = $database.getLastRow('log')
          (lastLog['type']).should.equal('DEPARTMENT_CHANGED')

    end
    it 'should change department if staff does not have ticket department and is author' do

        ticket = $database.getRow('ticket', 'Stafftitle', 'title')

        result = request('/ticket/change-department', {
            ticketNumber: ticket['ticket_number'],
            departmentId: 2,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        ticket = $database.getRow('ticket', 'Stafftitle', 'title')

        (result['status']).should.equal('success')
        (ticket['department_id']).should.equal(2)

        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1, 2, 3]',
            staffId: 1
        })
    end

    it 'should fail if tryes to change to the same deparment' do

        ticket = $database.getRow('ticket', 'Stafftitle', 'title')

        result = request('/ticket/change-department', {
            ticketNumber: ticket['ticket_number'],
            departmentId: 2,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        
        (result['status']).should.equal('fail')
        (result['message']).should.equal('SAME_DEPARTMENT')
        
    end

    it 'should not unassing ticket if owner has the new ticket department and staff does not have it' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        result = request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1, 2]',
            staffId: 1
        })
        (result['status']).should.equal('success')

        result = request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Jon Snow',
            email: 'jon_snow@opensupports.com',
            level: 2,
            profilePic: '',
            departments: '[1, 3]'
        })

        (result['status']).should.equal('success')

        Scripts.createTicket('title of the ticket to change department', 'this is the content of the ticket to change department', 1)

        staffId = $database.getRow('staff','jon_snow@opensupports.com','email')['id']
        ticket = $database.getRow('ticket', 'title of the ticket to change department', 'title')

        (ticket['owner_id']).should.equal(nil)

        result = request('/staff/assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            staffId: staffId,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'title of the ticket to change department', 'title')

        (ticket['owner_id']).should.equal(staffId)

        result = request('/ticket/change-department', {
            ticketNumber: ticket['ticket_number'],
            departmentId: 3,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'title of the ticket to change department', 'title')

        (ticket['owner_id']).should.equal(staffId)

        result = request('/staff/un-assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'title of the ticket to change department', 'title')

        (ticket['owner_id']).should.equal(nil)

        result = request('/ticket/delete', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            ticketNumber: ticket['ticket_number']
        })

        (result['status']).should.equal('success')

        staff = $database.getRow('staff', 'jon_snow@opensupports.com', 'email')
        Scripts.deleteStaff(staff['id'])
    end
    it 'should unassing ticket if owner has not the new ticket department' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        result = request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1, 2, 3]',
            staffId: 1
        })
        (result['status']).should.equal('success')

        result = request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Oberyn',
            email: 'Oberyn_martel@opensupports.com',
            level: 2,
            profilePic: '',
            departments: '[1, 2]'
        })

        (result['status']).should.equal('success')

        Scripts.createTicket('title of the ticket to change department', 'this is the content of the ticket to change department', 1)

        staffId = $database.getRow('staff','Oberyn_martel@opensupports.com','email')['id']
        ticket = $database.getRow('ticket', 'title of the ticket to change department', 'title')

        (ticket['owner_id']).should.equal(nil)

        result = request('/staff/assign-ticket', {
            ticketNumber: ticket['ticket_number'],
            staffId: staffId,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'title of the ticket to change department', 'title')

        (ticket['owner_id']).should.equal(staffId)

        result = request('/ticket/change-department', {
            ticketNumber: ticket['ticket_number'],
            departmentId: 3,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 'title of the ticket to change department', 'title')

        (ticket['owner_id']).should.equal(nil)

        result = request('/ticket/delete', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            ticketNumber: ticket['ticket_number']
        })

        (result['status']).should.equal('success')

        staff = $database.getRow('staff', 'Oberyn_martel@opensupports.com', 'email')

        Scripts.deleteStaff(staff['id'])
    end
end
