describe '/user/signup' do
  it 'should create user in database' do
      response = request('/user/signup', {
          'email' => 'steve@jobs.com',
          'password' => 'custom'
      })

      userRow = $database.getRow('users', response['data']['userId'])

      (userRow['email']).should.equal('steve@jobs.com')
  end
end
