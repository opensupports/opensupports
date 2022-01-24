describe 'Topic paths' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should add topic correctly' do
        result = request('/article/add-topic', {
            name: 'Server management',
            icon: 'cogs',
            iconColor: 'red',
            private: 0,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        topic = $database.getRow('topic', result['data']['topicId'])
        (topic['name']).should.equal('Server management')
        (topic['icon_color']).should.equal('red')
        (topic['icon']).should.equal('cogs')
        (topic['private']).should.equal(0)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('ADD_TOPIC')
    end

    it 'should success if topic has same name' do
        result = request('/article/edit-topic', {
            topicId: 1,
            name: 'Server management',
            iconColor: 'blue',
            private: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        topic = $database.getRow('topic', 1)
        (topic['icon_color']).should.equal('blue')
        (topic['name']).should.equal('Server management')
        
    end

    it 'should edit topic correctly' do
        result = request('/article/edit-topic', {
            topicId: 1,
            name: 'Installation issues',
            iconColor: 'blue',
            private: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        topic = $database.getRow('topic', 1)
        (topic['name']).should.equal('Installation issues')
        (topic['icon_color']).should.equal('blue')
        (topic['icon']).should.equal('cogs')
        (topic['private']).should.equal(1)
    end

    it 'should fail if data is already in use' do
        result = request('/article/add-topic', {
            name: 'Installation issues',
            icon: 'cogs',
            iconColor: 'red',
            private: 0,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NAME_ALREADY_USED')
    end

    it 'should edit topic if data  is right without name' do
        result = request('/article/add-topic', {
            name: 'Valid name',
            icon: 'cogs',
            iconColor: 'red',
            private: 0,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        
        topic = $database.getLastRow('topic')

        result = request('/article/edit-topic', {
            name: 'Valid name',
            topicId: topic['id'],
            iconColor: 'pink',
            icon: 'flag',
            private: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        topic = $database.getLastRow('topic')
        (result['status']).should.equal('success')
        (topic['icon_color']).should.equal('pink')
        (topic['name']).should.equal('Valid name')
    end

    it 'should delete topic correctly' do
        result = request('/article/delete-topic', {
            topicId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')

        topic = $database.getRow('topic', 1)
        (topic).should.equal(nil)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('DELETE_TOPIC')
    end

    it 'should deny permission if it is not logged as staff' do
        Scripts.logout()
        Scripts.login('tyrion@opensupports.com', 'tyrionl')

        result = request('/article/add-topic', {
            name: 'Server management',
            icon: 'cogs',
            iconColor: 'red',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')

        result = request('/article/edit-topic', {
            topicId: 1,
            name: 'Installation issues',
            iconColor: 'blue',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')

        result = request('/article/delete-topic', {
            topicId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
    end
end
