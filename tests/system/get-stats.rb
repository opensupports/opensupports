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

    @today = 199701010000
    @dateRangeBefore2000 = "[" + @today.to_s + ",200001010000]"
    @currTicket = 1

    def nextDay()
        @today += 10000
        @dateRangeBefore2000 = "[" + @today.to_s + ",200001010000]"
    end

    def createTicket(date = @today)
        result = request('/ticket/create', {
            title: "Stats Ticket ##{@currTicket}: Title",
            content: "Stats Ticket ##{@currTicket}: Content",
            departmentId: 1,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        $database.query("UPDATE ticket SET date=#{date} ORDER BY id DESC LIMIT 1")
        @currTicket += 1
    end

    def closeTicket(ticket_number)
        result = request('/ticket/close', {
            ticketNumber: ticket_number,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')
        return result
    end

    def reOpen(ticket_number)
        result = request('/ticket/re-open', {
            ticketNumber: ticket_number,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')
        return result
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
        (result['status']).should.equal('success')
        (result['data']['created']).should.equal(1)
        (result['data']['open']).should.equal(1)
        (result['data']['closed']).should.equal(0)
    end

    it 'should update number of open/closed tickets after a ticket is closed' do
        asStaff()
        ticket = $database.getLastRow('ticket')

        result = closeTicket(ticket['ticket_number'])

        result = request('/system/stats', {
            dateRange: @dateRangeBefore2000,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')
        (result['data']['created']).should.equal(1)
        (result['data']['open']).should.equal(0)
        (result['data']['closed']).should.equal(1)
    end

    it 'should update number of instant tickets after a ticket is replied by a single staff member' do
        asUser()
        createTicket()

        asStaff()
        ticket = $database.getLastRow('ticket')
        result = request('/ticket/comment', {
            content: 'This will be the only public reply to this ticket from a staff, then it will be closed',
            ticketNumber: ticket['ticket_number'],
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        result = closeTicket(ticket['ticket_number'])
        
        result = request('/system/stats', {
            dateRange: @dateRangeBefore2000,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')
        (result['data']['created']).should.equal(2)
        (result['data']['open']).should.equal(0)
        (result['data']['closed']).should.equal(2)
        (result['data']['instant']).should.equal(1)
    end
    
    it 'should update number of reopened tickets after a ticket is reopened' do
        asUser()
        createTicket()

        asStaff()
        ticket = $database.getLastRow('ticket')
        result = closeTicket(ticket['ticket_number'])
        result = reOpen(ticket['ticket_number'])

        result = request('/system/stats', {
            dateRange: @dateRangeBefore2000,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')
        (result['data']['created']).should.equal(3)
        (result['data']['open']).should.equal(1)
        (result['data']['closed']).should.equal(2)
        (result['data']['instant']).should.equal(1)
        (result['data']['reopened']).should.equal(1)
    end

    it 'should update created_by_hour accordingly' do
        nextDay()

        asUser()
        for h in 0..23
            # print("\n>>> Creating stat tickets for hour #{h}")
            createTicket(@today + h*100)      # First minute in this hour
            createTicket(@today + h*100 + 59) # Last minute in this hour

            for m in 1..h%3
                createTicket(@today + h*100 + 5 + m) # Internal minutes, 5 is padding
            end
        end

        asStaff()
        result = request('/system/stats', {
            dateRange: @dateRangeBefore2000,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')
        (result['data']['created_by_hour']).should.equal(Array.new(24) {|i| 2 + i%3})
    end
end
