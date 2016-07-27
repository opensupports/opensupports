describe '/user/signup' do
    it 'should create user in database' do
        response = request('/user/signup', {
          'name' => 'Steve Jobs',
          'email' => 'steve@jobs.com',
          'password' => 'custom'
        })

        userRow = $database.getRow('user', response['data']['userId'])

        (userRow['email']).should.equal('steve@jobs.com')
        (userRow['name']).should.equal('Steve Jobs')
    end

    it 'should fail if name is invalid' do
        long_text = ''
        100.times {long_text << 'a'}

        result = request('/user/signup', {
            name: 't',
            email: 'tyrion@outlook.com',
            password: 'Lannister'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('Invalid name')

        result = request('/user/signup', {
            name: long_text,
            email: 'tyrion@outlook.com',
            password: 'Lannister'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('Invalid name')

        result = request('/user/signup', {
            name: 'tyri0n',
            email: 'tyrion@outlook.com',
            password: 'Lannister'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('Invalid name')
    end

    it 'should fail if email is invalid' do
        result = request('/user/signup', {
            name: 'tyrion',
            email: 'tyrionoutlook.com',
            password: 'Lannister'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('Invalid email')

        result = request('/user/signup', {
            name: 'tyrion',
            email: 'tyrion@outlookcom',
            password: 'Lannister'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('Invalid email')
    end

    it 'should fail if password is invalid' do
        result = request('/user/signup', {
            name: 'tyrion',
            email: 'tyrion@outlook.com',
            password: 'Lann'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('Invalid password')

        long_text = ''
        250.times {long_text << 'a'}

        result = request('/user/signup', {
            name: 'tyrion',
            email: 'tyrion@outlook.com',
            password: long_text
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('Invalid password')
    end

end
