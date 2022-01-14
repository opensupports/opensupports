describe'system/add-api-key' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should add API key' do
        result= request('/system/add-api-key', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'new API',
            canCreateUser: 1
        })

        (result['status']).should.equal('success')

        row = $database.getRow('apikey', 2, 'id')

        (row['name']).should.equal('new API')
        (result['data']).should.equal(row['token'])
    end

    it 'should not add API key if name already used' do
        result= request('/system/add-api-key', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'new API',
            canCreateUser: 1
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NAME_ALREADY_USED')
    end

    it 'should fail if API key size is wrong' do
        result= request('/system/add-api-key', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: '',
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')

        result= request('/system/add-api-key', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'APIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAMEAPIKEYNAME',
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')
    end

    it 'should succes with the required permissions API key' do
        result= request('/system/add-api-key', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'APIkey ticketnumber return',
            shouldReturnTicketNumber: 'true'
        })

        (result['status']).should.equal('success')

        row = $database.getRow('apikey', 3, 'id')

        (row['can_create_users']).should.equal(0)
        (row['can_create_tickets']).should.equal(0)
        (row['should_return_ticket_number']).should.equal(1)
        (row['can_check_tickets']).should.equal(0)

        result= request('/system/add-api-key', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'APIkey check tickets',
            canCheckTickets: 'true'
        })

        (result['status']).should.equal('success')

        row = $database.getRow('apikey', 4, 'id')

        (row['can_create_users']).should.equal(0)
        (row['can_create_tickets']).should.equal(0)
        (row['should_return_ticket_number']).should.equal(0)
        (row['can_check_tickets']).should.equal(1)

        result= request('/system/add-api-key', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'APIkey user create',
            canCreateUsers: 'true'
        })

        (result['status']).should.equal('success')

        row = $database.getRow('apikey', 5, 'id')

        (row['can_create_users']).should.equal(1)
        (row['can_create_tickets']).should.equal(0)
        (row['should_return_ticket_number']).should.equal(0)
        (row['can_check_tickets']).should.equal(0)

        result= request('/system/add-api-key', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'APIkey  create tickets',
            canCreateTickets: 'true'
        })

        (result['status']).should.equal('success')

        row = $database.getRow('apikey', 6, 'id')

        (row['can_create_users']).should.equal(0)
        (row['can_create_tickets']).should.equal(1)
        (row['should_return_ticket_number']).should.equal(0)
        (row['can_check_tickets']).should.equal(0)
    end
end
