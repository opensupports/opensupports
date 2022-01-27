describe '/user/get-users' do

    Scripts.logout()
    Scripts.createUser('tests@hotmail.com','passdasdasdas','laasdasd')
    Scripts.createUser('tests2@hotmail.com','passfasfasfsa','laeaefae')
    Scripts.createUser('tests3@hotmail.com','passfasfasfws','laeczvwaf')

    result = request('/user/login', {
        email: $staff[:email],
        password: $staff[:password],
        staff: true
    })

    $csrf_userid = result['data']['userId']
    $csrf_token = result['data']['token']

    it 'should get users on first page' do
        result = request('/user/get-users', {
            page: 1,
            orderBy:'id',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        (result['data']['users'].size).should.equal(10)
        (result['data']['pages']).should.equal(2)
    end

    it 'should get users on second page' do
        result = request('/user/get-users', {
            page:2,
            orderBy:'id',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        (result['data']['users'].size).should.equal(8)
    end

    it 'should get users with order by tickets and asc' do
        result = request('/user/get-users', {
            page:1,
            orderBy:'tickets',
            desc:false,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        users = result['data']['users']
        (1..(users.size-1)).each do |i|
            (users[i]['tickets'].to_i >= users[i-1]['tickets'].to_i).should.equal(true)
        end
    end

    it 'should get users with order by tickets and desc' do
        result = request('/user/get-users', {
            page:1,
            orderBy:'tickets',
            desc:true,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        users = result['data']['users']
        (1..(users.size-1)).each do |i|
            (users[i]['tickets'].to_i <= users[i-1]['tickets'].to_i).should.equal(true)
        end
    end

    it 'should get users with search' do
        result = request('/user/get-users', {
            page:1,
            search:'la',
            orderBy:'id',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        (result['data']['users'][0]['name']).should.equal('laasdasd')
        (result['data']['users'][1]['name']).should.equal('laeaefae')
        (result['data']['users'][2]['name']).should.equal('laeczvwaf')
        (result['data']['users'][3]['name']).should.equal('Cersei Lannister')
        (result['data']['users'][4]['name']).should.equal('Tyrion Lannister')
    end
end
