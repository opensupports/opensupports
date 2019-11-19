describe '/ticket/seen' do

    describe 'when a staff is logged' do
        request('/user/logout')
        ticket = $database.getRow('ticket', 1, 'id')

        Scripts.login($staff[:email], $staff[:password], true)
        Scripts.assignTicket(ticket['ticket_number'])
        it 'should change unread if everything is okey ' do
            
            result = request('/ticket/seen', {
                        ticketNumber: ticket['ticket_number'],
                        csrf_userid: $csrf_userid,
                        csrf_token: $csrf_token
                    })
            (result['status']).should.equal('success')
            ticket = $database.getRow('ticket', 1, 'id')
            (ticket['unread_staff']).should.equal('0')

        end
    end

    describe 'when an user is logged' do
        
        request('/user/logout')
        Scripts.login()
        it 'should fail if user is not author' do
            ticket = $database.getRow('ticket', 1, 'id')
            result = request('/ticket/seen', {
                ticketNumber: ticket['ticket_number'],
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('NO_PERMISSION')
        end

        request('/user/logout')
        Scripts.login('user_get@os4.com', 'user_get')
        it 'should change unread if everything is okey ' do
            ticket = $database.getRow('ticket', 1, 'id')
            result = request('/ticket/seen', {
                ticketNumber: ticket['ticket_number'],
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            (result['status']).should.equal('success')
            ticket = $database.getRow('ticket', 1, 'id')
            (ticket['unread']).should.equal('0')
        end
    end

end
