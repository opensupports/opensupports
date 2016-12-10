describe'/staff/get-all' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should get all staff member' do
        result= request('/staff/get-all', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        (result['data'][0]['name']).should.equal('Emilia Clarke')
        (result['data'][0]['email']).should.equal('staff@opensupports.com')
        (result['data'][0]['profilePic']).should.equal('http://www.opensupports.com/profilepic.jpg')
        (result['data'][0]['level']).should.equal('3')
        (result['data'][0]['departments'][0]['id']).should.equal('1')
        (result['data'][0]['departments'][0]['name']).should.equal('Tech Support')
        (result['data'][0]['departments'][1]['id']).should.equal('2')
        (result['data'][0]['departments'][1]['name']).should.equal('Suggestions')
        (result['data'][0]['departments'][2]['id']).should.equal('3')
        (result['data'][0]['departments'][2]['name']).should.equal('Sales and Subscriptions')
        (result['data'][0]['assignedTickets']).should.equal(3)
        (result['data'][0]['closedTickets']).should.equal(0)

        (result['data'][1]['name']).should.equal('Arya Stark')
        (result['data'][1]['email']).should.equal('newwstaff@opensupports.com')
        (result['data'][1]['profilePic']).should.equal('http://www.opensupports.com/profilepic.jpg')
        (result['data'][1]['level']).should.equal('2')
        (result['data'][1]['departments'][0]['id']).should.equal('1')
        (result['data'][1]['departments'][0]['name']).should.equal('Tech Support')
        (result['data'][1]['assignedTickets']).should.equal(0)
        (result['data'][1]['closedTickets']).should.equal(0)
    end
end