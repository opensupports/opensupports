describe'system/edit-settings' do
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should edit settings' do
            result= request('/system/edit-settings', {
                "csrf_userid" => $csrf_userid,
                "csrf_token" => $csrf_token,
                "maintenance-mode" => 1,
                "time-zone" => -3,
                "layout" => 'full-width',
                "allow-attachments" => 1,
                "max-size" => 2,
                "language" => 'es',
                "no-reply-email" => 'testemail@hotmail.com'
            })

            (result['status']).should.equal('success')

            row = $database.getRow('setting', 'maintenance-mode', 'name')
            (row['value']).should.equal('1')

            row = $database.getRow('setting', 'time-zone', 'name')
            (row['value']).should.equal('-3')

            row = $database.getRow('setting', 'layout', 'name')
            (row['value']).should.equal('full-width')

            row = $database.getRow('setting', 'max-size', 'name')
            (row['value']).should.equal('2')

            row = $database.getRow('setting', 'language', 'name')
            (row['value']).should.equal('es')

            row = $database.getRow('setting', 'no-reply-email', 'name')
            (row['value']).should.equal('testemail@hotmail.com')

            request('/user/logout')
        end
end
