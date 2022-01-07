describe 'Article path' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)
    topic = request('/article/add-topic', {
        name: 'Server management',
        icon: 'cogs',
        iconColor: 'red',
        csrf_userid: $csrf_userid,
        csrf_token: $csrf_token,
        private: 0
    })
    @topic_id = topic['data']['topicId']

    it 'should create a private topic' do
        result = request('/article/add-topic', {
            name: 'Private Topic',
            icon: 'cogs',
            iconColor: 'green',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            private: 1
        })
        row = $database.getRow('topic', 'Private Topic', 'name')

        result['status'].should.equal('success')
        (row['private']).should.equal(1)
    end

    it 'should create article' do
        result = request('/article/add', {
            title: 'Some article',
            content: 'This is an article about server management.',
            topicId: @topic_id,
            position: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        @article_id = result['data']['articleId']
        article = $database.getRow('article', @article_id)
        (article['title']).should.equal('Some article')
        (article['content']).should.equal('This is an article about server management.')
        (article['topic_id']).should.equal(@topic_id)
        (article['position']).should.equal(1)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('ADD_ARTICLE')
    end

    it 'should edit article' do
        result = request('/article/edit', {
            articleId: @article_id,
            content: 'This is an article about server management2.',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        article = $database.getRow('article', @article_id)
        (article['title']).should.equal('Some article')
        (article['content']).should.equal('This is an article about server management2.')
        (article['topic_id']).should.equal(@topic_id)
        (article['position']).should.equal(1)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('EDIT_ARTICLE')
    end

    it 'should edit article topic' do
        request('/article/add-topic', {
            name: 'Software installation',
            icon: 'photo',
            iconColor: 'blue',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        result = request('/article/edit', {
            articleId: @article_id,
            topicId: @topic_id+1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        article = $database.getRow('article', @article_id)
        (article['title']).should.equal('Some article')
        (article['content']).should.equal('This is an article about server management2.')
        (article['topic_id']).should.equal((@topic_id+1))
        (article['position']).should.equal(1)
    end

    it 'should delete article' do
        result = request('/article/delete', {
            articleId: @article_id,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        article = $database.getRow('article', @article_id)
        (article).should.equal(nil)

        lastLog = $database.getLastRow('log')
        (lastLog['type']).should.equal('DELETE_ARTICLE')
    end

    it 'should retrieve all articles' do
        request('/article/add', {
            title: 'Some article',
            content: 'This is an article about server management.',
            topicId: @topic_id,
            position: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        result = request('/article/get-all', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        (result['data'][0]['name']).should.equal('Server management')
        (result['data'][0]['icon']).should.equal('cogs')
        (result['data'][0]['iconColor']).should.equal('red')
        (result['data'][0]['private']).should.equal('0')
        (result['data'][1]['name']).should.equal('Private Topic')
        (result['data'][1]['icon']).should.equal('cogs')
        (result['data'][1]['iconColor']).should.equal('green')
        (result['data'][1]['private']).should.equal('1')
        (result['data'][2]['name']).should.equal('Software installation')
        (result['data'][2]['icon']).should.equal('photo')
        (result['data'][2]['iconColor']).should.equal('blue')
        (result['data'][2]['private']).should.equal('0')

        (result['data'][0]['articles'][0]['title']).should.equal('Some article')
        (result['data'][0]['articles'][0]['content']).should.equal('This is an article about server management.')
        (result['data'][0]['articles'][0]['position']).should.equal('1')

    end
    it 'should retrieve public departments' do
        Scripts.logout()
        Scripts.login('tyrion@opensupports.com', 'tyrionl')

        result = request('/article/get-all', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        (result['data'][0]['name']).should.equal('Server management')
        (result['data'][0]['icon']).should.equal('cogs')
        (result['data'][0]['iconColor']).should.equal('red')
        (result['data'][0]['private']).should.equal('0')
        (result['data'][1]['name']).should.equal('Software installation')
        (result['data'][1]['icon']).should.equal('photo')
        (result['data'][1]['iconColor']).should.equal('blue')
        (result['data'][1]['private']).should.equal('0')
    end
end
