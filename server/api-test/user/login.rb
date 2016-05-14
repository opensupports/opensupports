describe '/user/login' do
    before do
        @loginEmail = 'login@os4.com'
        @loginPass = 'loginpass'

        Scripts.createUser(@loginEmail, @loginPass)
    end

    it 'should fail if password is incorrect' do
        result = request('/user/login', {
            email: @loginEmail,
            pass: 'some_incorrect_password'
        })

        (result['status']).should.equal('fail')
    end

    it 'should login correctly' do

    end

    it 'should fail if already logged in' do

    end
