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

    it 'report no stats before year 2000' do
        asStaff()
        result = request('/system/stats', {
            dateRange: "[197001010000,200001010000]",
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
end
