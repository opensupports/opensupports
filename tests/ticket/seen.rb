describe '/ticket/seen' do

    describe 'when a staff is logged' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should change unread if everything is okey ' do

            result = request('/ticket/seen', {
                        ticketNumber: ticket['ticket_number'],
                        csrf_userid: $csrf_userid,
                        csrf_token: $csrf_token
                    })
            (result['status']).should.equal('success')
        end
    end

    describe 'when a user is logged' do

        it 'should change unread if everything is okey ' do

        end
    end

end