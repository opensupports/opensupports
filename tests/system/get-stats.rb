describe '/system/stats/' do
    Scripts.createUser('statsuser@os4.com', 'StatsUser', 'StatsUser')

    def asUser()
        request('/user/logout')
        Scripts.login('statsuser@os4.com', 'StatsUser')
    end

    def asStaff()
        request('/user/logout')
        Scripts.login($staff[:email], $staff[:password], true)
    end

    @dateRangeBefore2000 = "[197001010000,200001010000]"
    @currTicket = 9901

    def createTicket()
        result = request('/ticket/create', {
            title: "Stats Ticket ##{@currTicket}: Title",
            content: "Stats Ticket ##{@currTicket}: Content",
            departmentId: 1,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        $database.query("UPDATE ticket SET date=199701010000 ORDER BY id DESC LIMIT 1")
        @currTicket += 1
    end

    it 'should report no stats before year 2000' do
        asStaff()
        result = request('/system/stats', {
            dateRange: @dateRangeBefore2000,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        (result['data']['created']).should.equal(0)
        (result['data']['open']).should.equal(0)
        (result['data']['closed']).should.equal(0)
        (result['data']['instant']).should.equal(0)
        (result['data']['reopened']).should.equal(0)
        (result['data']['created_by_hour'].count(0)).should.equal(24)
        (result['data']['created_by_weekday'].count(0)).should.equal(7)
        (result['data']['average_first_reply']).should.equal(0)
        (result['data']['average_first_closed']).should.equal(0)
        (result['data']['average_last_closed']).should.equal(0)
        (result['data']['average_department_hops']).should.equal(0.0)
        (result['data']['average_staff_hops']).should.equal(0.0)
    end

    it 'should update number of created tickets after a ticket is created' do
        asUser()
        createTicket()
        asStaff()
        result = request('/system/stats', {
            dateRange: @dateRangeBefore2000,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['data']['created']).should.equal(1)
        (result['data']['open']).should.equal(1)
        (result['data']['closed']).should.equal(0)
    end

    it 'should update number of closed tickets after a ticket is closed' do
        asStaff()
        ticket = $database.getLastRow('ticket')

        result = request('/ticket/close', {
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        result = request('/system/stats', {
            dateRange: @dateRangeBefore2000,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['data']['created']).should.equal(1)
        (result['data']['open']).should.equal(0)
        (result['data']['closed']).should.equal(1)
    end
end
