describe'system/csv-import' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        it 'should create user with csv-import' do

            file = File.new('../server/files/test.csv', 'w+')
            file.puts('prueba1@hotmail.com, contrasena1,ma')
            file.puts('prueba2@hotmail.com,contrasena2,max')
            file.puts('prueba3@hotmail.com,contrasena3,maxi')
            file.close

            result= request('/system/csv-import', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                password: $staff[:password],
                file: File.open( "../server/files/test.csv")
            })

            (result['status']).should.equal('success')
            row = $database.getRow('user', 'prueba1@hotmail.com', 'email')
            (row['name']).should.equal('ma')

            row = $database.getRow('user', 'prueba2@hotmail.com', 'email')
            (row['name']).should.equal('max')

            row = $database.getRow('user', 'prueba3@hotmail.com', 'email')
            (row['name']).should.equal('maxi')
        end
end
