describe '/user/resend-email-token' do

    Scripts.logout()

    it 'should fail is data is wrong' do
        result = request('/user/resend-email-token', {
            email: 'thisemaildoesnotexists@hotmail.com'
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')

        user = $database.getRow('user', '1' , 'id')

        result = request('/user/resend-email-token', {
            email: user['email']
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
    end
=begin
    it 'should resend email' do
        Scripts.createUser('usertobetestedbyresendemail@os4.com')

        result = request('/user/resend-email-token', {
            email: 'usertobetestedbyresendemail@hotmail.com'
        })

        (result['message']).should.equal('success')
    end
=end
end
