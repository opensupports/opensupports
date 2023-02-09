describe '/ticket/seen' do

    describe 'when a staff is logged' do
        Scripts.logout()
        ticket = $database.getRow('ticket', 'Should we pay?', 'title')

        Scripts.login($staff[:email], $staff[:password], true)
        Scripts.assignTicket(ticket['ticket_number'])
        it 'should change unread if everything is okay ' do
            
            result = request('/ticket/seen', {
                        ticketNumber: ticket['ticket_number'],
                        csrf_userid: $csrf_userid,
                        csrf_token: $csrf_token
                    })
            (result['status']).should.equal('success')
            ticket = $database.getRow('ticket', 'Should we pay?', 'title')
            (ticket['unread_staff']).should.equal(0)

        end
    end

    describe 'when an user is logged' do
        
        Scripts.logout()
        Scripts.login()
        it 'should fail if user is not author' do
            ticket = $database.getRow('ticket', 'Should we pay?', 'title')
            result = request('/ticket/seen', {
                ticketNumber: ticket['ticket_number'],
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('NO_PERMISSION')
        end

        Scripts.logout()
        Scripts.login('user_get@os4.com', 'user_get')
        it 'should change unread if everything is okay ' do
            ticket = $database.getRow('ticket', 'Should we pay?', 'title')
            result = request('/ticket/seen', {
                ticketNumber: ticket['ticket_number'],
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            (result['status']).should.equal('success')
            ticket = $database.getRow('ticket', 'Should we pay?', 'title')
            (ticket['unread']).should.equal(0)
        end
    end

end
