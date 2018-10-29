describe '/ticket/delete' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)
    Scripts.createTicket('tickettodelete')
    Scripts.createTicket('tickettodelete4')

    # it 'should delete ticket if it is not assigned and  is logged a staff lvl 3 ' do
    #
    #
    #     ticket = $database.getRow('ticket', 'tickettodelete', 'title')
    #
    #     request('/staff/add', {
    #         csrf_userid: $csrf_userid,
    #         csrf_token: $csrf_token,
    #         name: 'Ned Stark',
    #         password: 'headless',
    #         email: 'ned@opensupports.com',
    #         level: 3,
    #         profilePic: '',
    #         departments: '[1]'
    #     })
    #
    #     request('/user/logout')
    #
    #     Scripts.login('ned@opensupports.com', 'headless', true)
    #
    #     result = request('/ticket/delete', {
    #         ticketNumber: ticket['ticket_number'],
    #         csrf_userid: $csrf_userid,
    #         csrf_token: $csrf_token
    #     })
    #
    #     (result['status']).should.equal('success')
    # end

    it 'should delete ticket if it is yours and it is not assigned' do
      request('/user/logout')
      Scripts.createUser('deleter@opensupports.com', 'deleterpassword', 'Delter')
      Scripts.login('deleter@opensupports.com', 'deleterpassword')

      Scripts.createTicket('tickettodelete2')
      ticket = $database.getRow('ticket', 'tickettodelete2', 'title');

      result = request('/ticket/delete', {
          ticketNumber: ticket['ticket_number'],
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token
      })
      puts result
      (result['status']).should.equal('success')
    end

    it 'should not delete ticket if it is assigned' do
      request('/user/logout')
      Scripts.login('deleter@opensupports.com', 'deleterpassword')

      Scripts.createTicket('tickettodelete3')
      ticket = $database.getRow('ticket', 'tickettodelete3', 'title');

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
    end

    it 'should not delete ticket if the staff logged is not lvl 3' do
         request('/user/logout')

         Scripts.login($staff[:email], $staff[:password], true)

         ticket = $database.getRow('ticket', 'tickettodelete4', 'title');

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

    end

    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)
    staff = $database.getRow('staff', 'headless', 'password')
    Scripts.deleteStaff(staff['id'])

    staff = $database.getRow('staff', 'theyaregonnafireme', 'password')
    Scripts.deleteStaff(staff['id'])

end
