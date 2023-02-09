describe 'File Upload and Download' do
    Scripts.logout()
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
        (ticket['file'].include? ('' + ticket['ticket_number'].to_s + '_')).should.equal(true)
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

    it 'should download if department owner is logged' do
        Scripts.logout()
        Scripts.login($staff[:email], $staff[:password], true)

        ticket = $database.getLastRow('ticket')
        file = File.open("../server/files/" + ticket['file'])

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
        (user['profile_pic'][0] == 'p').should.equal(true)

        result = plainRequest('/system/download', {
            'csrf_userid' => $csrf_userid,
            'csrf_token' => $csrf_token,
            'file' => user['profile_pic']
        }, 'GET')

        (result.body).should.include('file content')
    end

    it 'should add images to ticket content when creating a new ticket' do
        Scripts.logout()
        Scripts.login('creator@os4.com', 'creator')

        file = File.open( "../server/files/profile.jpg")

        result = request('/ticket/create', {
            'csrf_userid' => $csrf_userid,
            'csrf_token' => $csrf_token,
            'title' => 'Ticket with file',
            'content' => 'this is a ticket <img src="IMAGE_PATH_0" /> that contains images <img src="IMAGE_PATH_1" />',
            'language' => 'en',
            'departmentId' => 1,
            'images' => 2,
            'image_0' => File.open( "../server/files/profile.jpg"),
            'image_1' => File.open( "../server/files/profile.jpg"),
        })

        (result['status']).should.equal('success')

        ticket = $database.getLastRow('ticket')

        (ticket['content'].include? '_profile.jpg').should.equal(true)
    end
end
