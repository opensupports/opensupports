describe '/ticket/delete' do

    it 'should delete ticket if it is not assigned and is logged a staff lvl 3 ' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        Scripts.createTicket('ticket_to_delete')
        ticket = $database.getRow('ticket', 'ticket_to_delete', 'title')

        request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Ned Stark',
            email: 'ned@opensupports.com',
            level: 3,
            profilePic: '',
            departments: '[1]'
        })

        recoverpassword = $database.getRow('recoverpassword', 'ned@opensupports.com', 'email')

        request('/user/recover-password', {
            email: 'ned@opensupports.com',
            password: 'headless',
            token: recoverpassword['token']
        })

        Scripts.logout()
        Scripts.login('ned@opensupports.com', 'headless', true)

        result = request('/ticket/delete', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
    end

    it 'should delete ticket if it is yours and it is not assigned' do
      Scripts.logout()
      Scripts.createUser('deleter@opensupports.com', 'deleterpassword', 'Delter')
      Scripts.login('deleter@opensupports.com', 'deleterpassword')

      Scripts.createTicket('ticket_to_delete_2')
      ticket = $database.getRow('ticket', 'ticket_to_delete_2', 'title')
      result = request('/ticket/delete', {
          ticketNumber: ticket['ticket_number'],
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token
      })
      (result['status']).should.equal('success')
    end

    it 'should not delete ticket if it is assigned' do
      Scripts.logout()
      Scripts.login('deleter@opensupports.com', 'deleterpassword')

      Scripts.createTicket('ticket_to_delete_3')
      ticket = $database.getRow('ticket', 'ticket_to_delete_3', 'title')

      Scripts.logout()
      Scripts.login($staff[:email], $staff[:password], true)

      result = request('/staff/assign-ticket', {
          ticketNumber: ticket['ticket_number'],
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token
      })

      Scripts.logout()
      Scripts.login('deleter@opensupports.com', 'deleterpassword')

      result = request('/ticket/delete', {
          ticketNumber: ticket['ticket_number'],
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token
      })

      (result['status']).should.equal('fail')
      (result['message']).should.equal('NO_PERMISSION')
    end

    it 'should not delete ticket if the staff logged is not lvl 3' do
         Scripts.logout()
         Scripts.login($staff[:email], $staff[:password], true)
         Scripts.createTicket('ticket_to_delete_4')

         ticket = $database.getRow('ticket', 'ticket_to_delete_4', 'title')

         request('/staff/invite', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Joan Chris',
            email: 'uselessstaff@opensupports.com',
            level: 2,
            profilePic: '',
            departments: '[1]'
         })

         recoverpassword = $database.getRow('recoverpassword', 'uselessstaff@opensupports.com', 'email')

         request('/user/recover-password', {
             email: 'uselessstaff@opensupports.com',
             password: 'theyaregonnafireme',
             token: recoverpassword['token']
         })

         Scripts.logout()

         Scripts.login('uselessstaff@opensupports.com', 'theyaregonnafireme',true)

         result = request('/ticket/delete', {
             ticketNumber: ticket['ticket_number'],
             csrf_userid: $csrf_userid,
             csrf_token: $csrf_token
         })

         (result['status']).should.equal('fail')
         (result['message']).should.equal('NO_PERMISSION')

         Scripts.logout()
         Scripts.login($staff[:email], $staff[:password], true)
         staff = $database.getRow('staff', 'ned@opensupports.com', 'email')
         Scripts.deleteStaff(staff['id'])

         staff = $database.getRow('staff', 'uselessstaff@opensupports.com', 'email')
         Scripts.deleteStaff(staff['id'])
    end
end
