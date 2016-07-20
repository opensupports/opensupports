describe '/user/sendrecoverpassword' do
    @recoverEmail = 'recover@os4.com'
    @recoverPass = 'recover'

    Scripts.createUser(@recoverEmail, @recoverPass)

    it 'should fail if email is incorrect' do
        result = request('/user/sendrecoverpassword', {
            email: 'login@os4com'
        })

        (result['status']).should.equal('fail');

        result = request('/user/sendrecoverpassword', {
            email: 'loginos4.com'
        })

        (result['status']).should.equal('fail');
    end
    it 'should success if email is correct' do
        result = request('/user/sendrecoverpassword', {
            email: @recoverEmail
        })

        (result['status']).should.equal('success')
    end
end
