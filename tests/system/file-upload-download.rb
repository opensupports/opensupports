describe 'File Upload and Download' do
    request('/user/logout')
    Scripts.login('creator@os4.com', 'creator')

    it 'should upload file when creating ticket' do
        file = File.new('../server/files/upload(3).txt', 'w+')
        file.puts('file content')
        file.close

        result = request('/ticket/create', {
            'csrf_userid' => $csrf_userid,
            'csrf_token' => $csrf_token,
            'title' => 'Ticket with file',
            'content' => 'this is a ticket that contains a file',
            'language' => 'en',
            'departmentId' => 1,
            'file' => File.open( "../server/files/upload(3).txt")
        })
        (result['status']).should.equal('success')

        ticket = $database.getLastRow('ticket')

        (ticket['file'].include? 'upload_3_.txt').should.equal(true)
        (File.exist? ('../server/files/' + ticket['file'])).should.equal(true)
    end

    it 'should download file if author is logged' do
        ticket = $database.getLastRow('ticket')
        file = File.open("../server/files/" + ticket['file'])

        result = plainRequest('/system/download', {
            'csrf_userid' => $csrf_userid,
            'csrf_token' => $csrf_token,
            'file' => ticket['file']
        }, 'GET')

        (result.body).should.equal(file.read)
    end

    it 'should not download if author is not logged' do
        request('/user/logout')
        Scripts.login('staff@opensupports.com', 'staff', true)

        ticket = $database.getLastRow('ticket')

        result = plainRequest('/system/download', {
            'csrf_userid' => $csrf_userid,
            'csrf_token' => $csrf_token,
            'file' => ticket['file']
        }, 'GET')

        (result.body).should.equal('')
    end

    it 'should download if owner is logged' do
        ticket = $database.getLastRow('ticket')
        file = File.open("../server/files/" + ticket['file'])

        request('/staff/assign-ticket', {
            'csrf_userid' => $csrf_userid,
            'csrf_token' => $csrf_token,
            'ticketNumber' => ticket['ticket_number']
        })

        result = plainRequest('/system/download', {
            'csrf_userid' => $csrf_userid,
            'csrf_token' => $csrf_token,
            'file' => ticket['file']
        }, 'GET')

        (result.body).should.equal(file.read)
    end

    it 'should upload profile picture' do
        file = File.new('../server/files/profile.jpg', 'w+')
        file.puts('file content')
        file.close

        request('/staff/edit', {
            'csrf_userid' => $csrf_userid,
            'csrf_token' => $csrf_token,
            'staffId' => $csrf_userid,
            'file' => File.open( "../server/files/profile.jpg")
        })

        user = $database.getRow('staff', $csrf_userid)

        result = plainRequest('/system/download', {
            'csrf_userid' => $csrf_userid,
            'csrf_token' => $csrf_token,
            'file' => user['profile_pic']
        }, 'GET')

        (result.body).should.include('file content')
    end
end
