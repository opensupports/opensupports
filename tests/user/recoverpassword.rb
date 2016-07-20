describe '/user/recoverpassword' do
    @recoverEmail = 'recover@os4.com'
    @newRecoverPass = 'newrecover'

    it 'should fail if email is incorrect' do
        result = request('/user/recoverpassword', {
            email: 'login@os4com',
            password: @newRecoverPass
        })

        (result['status']).should.equal('fail');

        result = request('/user/recoverpassword', {
            email: 'loginos4.com',
            password: @newRecoverPass
        })

        (result['status']).should.equal('fail');
    end

    it 'should fail if password is incorrect' do
        result = request('/user/recoverpassword',{
            email: @recoverEmail,
            password: 'log'
        })

        (result['status']).should.equal('fail');

        long_text = ''
        250.times {long_text << 'a'}

        result = request('/user/recoverpassword',{
            email: @recoverEmail,
            password: long_text
        })

        (result['status']).should.equal('fail');
    end
end
