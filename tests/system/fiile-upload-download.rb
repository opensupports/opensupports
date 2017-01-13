describe 'File Upload and Download' do
    request('/user/logout')
    Scripts.login("creator@os4.com", "creator")

    it 'should upload file when creating ticket' do
        file = File.new('upload.txt', 'w')
        file.puts('file content')

        result = request('/ticket/create', {
            'csrf_userid' => $csrf_userid,
            'csrf_token' => $csrf_token,
            'title' => 'Ticket with file',
            'content' => 'this is a ticket that contains a file',
            'language' => 'en',
            'file' => file
        })
        (result['status']).should.equal('success');

        ticket = $database.getLastRow('ticket');

        (ticket['file'].include? 'upload.txt').should.equal(true)
        (File.exist?('../server/files' + ticket['file'])).should.equal(true)
    end
end
