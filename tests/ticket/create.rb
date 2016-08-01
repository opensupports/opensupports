describe '/ticket/create' do
  it 'should fail if title is too short' do
      result = request('/ticket/create', {
          title: 'GG'
      })

      (result['status']).should.equal('fail')
      (result['message']).should.equal('Invalid title')

  end

  it 'should fail if title is very long' do
      result = request('/ticket/create',{
          title: 'I WISH I WAS THE MONSTER YOU THINK I AM. -Tyrion'
      })

      (result['status']).should.equal('fail')
      (result['message']).should.equal('Invalid title')

  end

  it 'should fail if content is too short' do
      result = request('/ticket/create',{
          title: 'Winter is coming',
          content: 'Test'
      })

      (result['status']).should.equal('fail')
      (result['message']).should.equal('Invalid content')
  end

  it 'should fail if content is very long' do
    long_text = ''
    600.times {long_text << 'a'}

    result = request('/ticket/create',{
        title: 'Winter is coming',
        content: long_text
    })

    (result['status']).should.equal('fail')
    (result['message']).should.equal('Invalid content')

  end

  it 'should create ticket if pass data is valid' do
      result = request('/ticket/create',{
          title: 'Winter is coming',
          content: 'The north remembers'
      })

      (result['status']).should.equal('success')
      ticket = $database.getRow('ticket','Winter is coming','title')
      (ticket['content']).should.equal('The north remembers')
  end
end