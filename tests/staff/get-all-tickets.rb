describe 'Retrieve all tickets' do
    describe '/staff/get-all-tickets' do
        Scripts.login('login@os4.com', 'loginpass')

        def createTicket(title)
            request('/ticket/create',{
                title: title,
                content: 'The north remembers',
                departmentId: 1,
                language: 'en',
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })
        end

        it 'should return last tickets tickets' do
            createTicket('Integer sit amet tellus cursus')
            createTicket('consequat tortor sed')
            createTicket('Fusce lacinia felis quis molestie pellentesque')
            createTicket('Aliquam fringilla dapibus lacus')
            createTicket('Aenean enim orci')
            createTicket('luctus in sagittis non')
            createTicket('consectetur at velit')
            createTicket('Etiam et maximus quam')
            createTicket('Donec facilisis pelleipsumntesque feugiat')
            createTicket('Cras gravida bibendum vehicula')
            createTicket('Fusce venenatis iaculis commodo')
            createTicket('quis vulputate lectus feugiat eu')
            createTicket('ipsum Aenean maximus quis leo et eleifend')
            createTicket('In vel ex semper nisl sollicitudin')
            createTicket('volutpat vel nec enim')
            createTicket('Ut semper viverra nulla')
            createTicket('Duis consequat nec metus a vestibulum')
            createTicket('Vestibulum porta justo id sem bibendum lacinia')
            createTicket('Phasellus erat ipsum')
            createTicket('imperdiet vel auctor sed')
            createTicket('placerat id velit')
            createTicket('Quisque egestas ipsum')

            Scripts.logout()
            Scripts.login($staff[:email], $staff[:password], true)
            response = request('/staff/get-all-tickets', {
                page: 1,
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            (response['status']).should.equal('success')
            (response['data']['pages']).should.equal(7)
            (response['data']['tickets'].size).should.equal(10)
            (response['data']['tickets'][0]['title']).should.equal('Quisque egestas ipsum')
            (response['data']['tickets'][1]['title']).should.equal('placerat id velit')
            (response['data']['tickets'][2]['title']).should.equal('imperdiet vel auctor sed')
            (response['data']['tickets'][3]['title']).should.equal('Phasellus erat ipsum')
            (response['data']['tickets'][4]['title']).should.equal('Vestibulum porta justo id sem bibendum lacinia')
            (response['data']['tickets'][5]['title']).should.equal('Duis consequat nec metus a vestibulum')
            (response['data']['tickets'][6]['title']).should.equal('Ut semper viverra nulla')
            (response['data']['tickets'][7]['title']).should.equal('volutpat vel nec enim')
            (response['data']['tickets'][8]['title']).should.equal('In vel ex semper nisl sollicitudin')
            (response['data']['tickets'][9]['title']).should.equal('ipsum Aenean maximus quis leo et eleifend')
        end

        it 'should work with pagination' do
            response = request('/staff/get-all-tickets', {
                page: 2,
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            (response['status']).should.equal('success')
            (response['data']['pages']).should.equal(7)
            (response['data']['tickets'].size).should.equal(10)
            (response['data']['tickets'][0]['title']).should.equal('quis vulputate lectus feugiat eu')
            (response['data']['tickets'][1]['title']).should.equal('Fusce venenatis iaculis commodo')
            (response['data']['tickets'][2]['title']).should.equal('Cras gravida bibendum vehicula')
            (response['data']['tickets'][3]['title']).should.equal('Donec facilisis pelleipsumntesque feugiat')
            (response['data']['tickets'][4]['title']).should.equal('Etiam et maximus quam')
            (response['data']['tickets'][5]['title']).should.equal('consectetur at velit')
            (response['data']['tickets'][6]['title']).should.equal('luctus in sagittis non')
            (response['data']['tickets'][7]['title']).should.equal('Aenean enim orci')
            (response['data']['tickets'][8]['title']).should.equal('Aliquam fringilla dapibus lacus')
            (response['data']['tickets'][9]['title']).should.equal('Fusce lacinia felis quis molestie pellentesque')
        end
    end

    describe '/staff/search-tickets' do
        response = request('/staff/search-tickets', {
            query: 'ipsum',
            page: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (response['status']).should.equal('success')
        (response['data']['pages']).should.equal(4)
        (response['data']['tickets'].size).should.equal(10)
        (response['data']['tickets'][0]['title']).should.equal('ipsum Aenean maximus quis leo et eleifend')
    end
end
