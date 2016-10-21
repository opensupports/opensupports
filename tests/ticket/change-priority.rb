describe '/ticket/change-priority' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    #TODO: things that Ivan don't forget

    it 'should change priority to high if everything is okey' do
        ticket = $database.getRow('ticket', 1 , 'id')

        result = request('/ticket/change-priority', {
            priority:'high',
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 1 , 'id')
        (ticket['priority']).should.equal('high')
        (ticket['unread']).should.equal('1')
    end

    it 'should change priority to medium if everything is okey' do
        ticket = $database.getRow('ticket', 1 , 'id')

        result = request('/ticket/change-priority', {
            priority:'medium',
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 1 , 'id')
        (ticket['priority']).should.equal('medium')
        (ticket['unread']).should.equal('1')
    end

    it 'should change priority to low if everything is okey' do
        ticket = $database.getRow('ticket', 1 , 'id')

        result = request('/ticket/change-priority', {
            priority:'low',
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        ticket = $database.getRow('ticket', 1 , 'id')
        (ticket['priority']).should.equal('low')
        (ticket['unread']).should.equal('1')
    end

end