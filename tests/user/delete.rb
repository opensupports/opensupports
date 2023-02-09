describe '/user/delete' do
    Scripts.logout()

    it 'should delete user' do
        Scripts.createUser('deletable@opensupports.com', 'deletable')
        Scripts.login('deletable@opensupports.com', 'deletable')
        Scripts.createTicket('Ticket that will be deleted')

        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)
        ticket = $database.getLastRow('ticket')
        deletable_user = $database.getLastRow('user')

        result = request('/user/delete', {
            userId: deletable_user['id'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        last_ticket = $database.getLastRow('ticket')
        last_log = $database.getLastRow('log')
        user = $database.getRow('user', deletable_user['id'] , 'id')

        (user).should.equal(nil)
        (ticket['id']).should.not.equal(last_ticket['id'])
        (last_log['type']).should.equal('DELETE_USER')
    end
end
