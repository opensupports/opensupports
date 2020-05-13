describe '/ticket/change-department' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    Scripts.createTicket('Stafftitle','This ticket was made by an staff',1)
    request('/user/logout')

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

        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)
        ticket = $database.getRow('ticket', 1 , 'id')

        result = request('/ticket/change-department', {
            ticketNumber: ticket['ticket_number'],
            departmentId: 4,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 1 , 'id')
        (ticket['unread']).should.equal(1)
        (ticket['department_id']).should.equal(4)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('DEPARTMENT_CHANGED')
    end

    it 'should unassing ticket if staff does not server new department' do

          ticket = $database.getRow('ticket', 1 , 'id')
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

          ticket = $database.getRow('ticket', 1 , 'id')
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
            departmentId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        (ticket['department_id']).should.equal(1)

        request('/staff/edit', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            departments: '[1, 2, 3]',
            staffId: 1
        })
    end
end
