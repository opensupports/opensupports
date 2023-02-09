describe '/user/recover-password' do
    @recoverEmail = 'recover@os4.com'
    @newRecoverPass = 'newrecover'

    it 'should fail if email is incorrect' do
        result = request('/user/recover-password', {
            email: 'login@os4com',
            password: @newRecoverPass
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_EMAIL')

        result = request('/user/recover-password', {
            email: 'loginos4.com',
            password: @newRecoverPass
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_EMAIL')
    end

    it 'should fail if password is incorrect' do
        result = request('/user/recover-password', {
            email: @recoverEmail,
            password: 'log'
        })

        (result['status']).should.equal('fail')

        long_text = ''
        250.times {long_text << 'a'}

        result = request('/user/recover-password', {
            email: @recoverEmail,
            password: long_text
        })

        (result['status']).should.equal('fail')
    end

    it 'should fail if token is incorrect' do
        result = request('/user/recover-password', {
            email: @recoverEmail,
            token: 'INVALID_TOKEN',
            password: @newRecoverPass
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
    end
end
