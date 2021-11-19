describe '/user/signup' do
    it 'should create user in database' do
        response = request('/user/signup', {
          :name => 'Steve Jobs',
          :email => 'steve@jobs.com',
          :password => 'custompassword'
        })

        userRow = $database.getRow('user', response['data']['userId'])

        request('/user/verify', {
          :email => 'steve@jobs.com',
          :token => userRow['verification_token']
        })

        (userRow['email']).should.equal('steve@jobs.com')
        (userRow['name']).should.equal('Steve Jobs')

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('SIGNUP')
    end

    it 'should fail if name is invalid' do
        long_text = ''
        201.times {long_text << 'a'}

        result = request('/user/signup', {
            name: '',
            email: 'tyrion@outlook.com',
            password: 'Lannister'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')

        result = request('/user/signup', {
            name: long_text,
            email: 'tyrion@outlook.com',
            password: 'Lannister'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_NAME')
    end

    it 'should fail if email is invalid' do
        result = request('/user/signup', {
            name: 'tyrion',
            email: 'tyrionoutlook.com',
            password: 'Lannister'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_EMAIL')

        result = request('/user/signup', {
            name: 'tyrion',
            email: 'tyrion@outlookcom',
            password: 'Lannister'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_EMAIL')
    end

    it 'should fail if password is invalid' do
        result = request('/user/signup', {
            name: 'tyrion',
            email: 'tyrion@outlook.com',
            password: 'Lann'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_PASSWORD')

        long_text = ''
        250.times {long_text << 'a'}

        result = request('/user/signup', {
            name: 'tyrion',
            email: 'tyrion@outlook.com',
            password: long_text
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_PASSWORD')
    end

end
