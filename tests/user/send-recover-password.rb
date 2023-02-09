describe '/user/send-recover-password' do
    @recoverEmail = 'recover@os4.com'
    @recoverPass = 'recover'

    Scripts.createUser(@recoverEmail, @recoverPass)

    it 'should fail if email is incorrect' do
        result = request('/user/send-recover-password', {
            email: 'login@os4com'
        })

        (result['status']).should.equal('fail')

        result = request('/user/send-recover-password', {
            email: 'loginos4.com'
        })

        (result['status']).should.equal('fail')

        result = request('/user/send-recover-password', {
            email: 'invalid@invalid.com'
        })

        (result['status']).should.equal('fail')
    end

    it 'should success if email is correct' do
        result = request('/user/send-recover-password', {
            email: @recoverEmail
        })

        (result['status']).should.equal('success')
    end
end
