describe'/staff/get-all' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should get all staff member' do
        result= request('/staff/get-all', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        result['data'][0]['departments'] = result['data'][0]['departments'].sort_by do |department|
            department['id'].to_i
        end

        (result['data'][0]['name']).should.equal('Emilia Clarke')
        (result['data'][0]['email']).should.equal($staff[:email])
        (result['data'][0]['profilePic']).should.equal('')
        (result['data'][0]['level']).should.equal('3')
        (result['data'][0]['departments'][0]['id']).should.equal('1')
        (result['data'][0]['departments'][0]['name']).should.equal('Help and Support')
        (result['data'][0]['departments'][1]['id']).should.equal('2')
        (result['data'][0]['departments'][1]['name']).should.equal('useless private deapartment')
        (result['data'][0]['departments'][2]['id']).should.equal('3')
        (result['data'][0]['departments'][2]['name']).should.equal('Suggestions')
        (result['data'][0]['assignedTickets']).should.equal(22)
        (result['data'][0]['closedTickets']).should.equal(0)

        (result['data'][2]['name']).should.equal('Arya Stark')
        (result['data'][2]['email']).should.equal('ayra2@opensupports.com')
        (result['data'][2]['profilePic']).should.equal('')
        (result['data'][2]['level']).should.equal('2')
        (result['data'][2]['departments'][0]['id']).should.equal('1')
        (result['data'][2]['departments'][0]['name']).should.equal('Help and Support')
        (result['data'][2]['assignedTickets']).should.equal(1)
        (result['data'][2]['closedTickets']).should.equal(0)
    end
end
