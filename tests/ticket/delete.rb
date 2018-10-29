describe '/ticket/delete' do

    it 'should delete ticket if it is not assigned and is logged a staff lvl 3 ' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)
        Scripts.createTicket('ticket_to_delete')
        ticket = $database.getRow('ticket', 'ticket_to_delete', 'title')

        request('/staff/add', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'Ned Stark',
            password: 'headless',
            email: 'ned@opensupports.com',
            level: 3,
            profilePic: '',
            departments: '[1]'
        })

        request('/user/logout')
        Scripts.login('ned@opensupports.com', 'headless', true)

        result = request('/ticket/delete', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
    end

    it 'should delete ticket if it is yours and it is not assigned' do
      request('/user/logout')
      Scripts.createUser('deleter@opensupports.com', 'deleterpassword', 'Delter')
      Scripts.login('deleter@opensupports.com', 'deleterpassword')

      Scripts.createTicket('ticket_to_delete_2')
      ticket = $database.getRow('ticket', 'ticket_to_delete_2', 'title');
      result = request('/ticket/delete', {
          ticketNumber: ticket['ticket_number'],
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token
      })
      (result['status']).should.equal('success')
    end

    it 'should not delete ticket if it is assigned' do
      request('/user/logout')
      Scripts.login('deleter@opensupports.com', 'deleterpassword')

      Scripts.createTicket('ticket_to_delete_3')
      ticket = $database.getRow('ticket', 'ticket_to_delete_3', 'title');

      request('/user/logout')
      Scripts.login($staff[:email], $staff[:password], true)

      result = request('/staff/assign-ticket', {
          ticketNumber: ticket['ticket_number'],
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token
      })

      request('/user/logout')
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
         request('/user/logout')
         Scripts.login($staff[:email], $staff[:password], true)
         Scripts.createTicket('ticket_to_delete_4')

         ticket = $database.getRow('ticket', 'ticket_to_delete_4', 'title');

         request('/staff/add', {
             csrf_userid: $csrf_userid,
             csrf_token: $csrf_token,
             name: 'Joan Chris',
             password: 'theyaregonnafireme',
             email: 'uselessstaff@opensupports.com',
             level: 2,
             profilePic: '',
             departments: '[1]'
         })
         request('/user/logout')

         Scripts.login('uselessstaff@opensupports.com', 'theyaregonnafireme',true)

         result = request('/ticket/delete', {
             ticketNumber: ticket['ticket_number'],
             csrf_userid: $csrf_userid,
             csrf_token: $csrf_token
         })

         (result['status']).should.equal('fail')
         (result['message']).should.equal('NO_PERMISSION')

         request('/user/logout')
         Scripts.login($staff[:email], $staff[:password], true)
         staff = $database.getRow('staff', 'ned@opensupports.com', 'email')
         Scripts.deleteStaff(staff['id'])

         staff = $database.getRow('staff', 'uselessstaff@opensupports.com', 'email')
         Scripts.deleteStaff(staff['id'])
    end
end
