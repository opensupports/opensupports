describe '/ticket/seen' do

    describe 'when a staff is logged' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should change unread if everything is okey ' do
            ticket = $database.getRow('ticket', 1, 'id')
            result = request('/ticket/seen', {
                        ticketNumber: ticket['ticket_number'],
                        csrf_userid: $csrf_userid,
                        csrf_token: $csrf_token
                    })
            (result['status']).should.equal('success')
            ticket = $database.getRow('ticket', 1, 'id')
            (ticket['unreadStaff']).should.equal('0')

        end
    end

    describe 'when a user is logged' do

        request('/user/logout')
        Scripts.login()
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