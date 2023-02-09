describe'/system/enable-registration' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should not enable registration if password is not correct' do
        result= request('/system/enable-registration', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            password: 'hello'
        })

        (result['status']).should.equal('fail')

        row = $database.getRow('setting', 'registration', 'name')

        (row['value']).should.equal('0')
    end

    it 'should enable registration' do
        result= request('/system/enable-registration', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            password: $staff[:password]
        })

        (result['status']).should.equal('success')

        row = $database.getRow('setting', 'registration', 'name')

        (row['value']).should.equal('1')
    end

end
