describe '/ticket/search' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)


    it 'should fail if the page is invalid' do
        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: -1
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_PAGE')
    end

    it 'should fail if the tags are invalid' do
        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            tags: "[1,11,111,1111,11111,111111,1111111,11111111]"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_TAG_FILTER')
    end

    it 'should fail if the closed value is invalid' do
        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            closed: 3
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_CLOSED_FILTER')
    end

    it 'should fail if the unreadStaff value is invalid' do
        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            unreadStaff: 3
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_UNREAD_STAFF_FILTER')
    end

    it 'should fail if the priority values are invalid' do
        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            priority: "[0,1,5,6]"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_PRIORITY_FILTER')
    end

    it 'should fail if the priority' do
        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            priority: "[0,1,),hi]"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_PRIORITY_FILTER')
    end

    it 'should fail if the dateRange values are invalid' do
        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            dateRange: "[11,69,()) ]"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_DATE_RANGE_FILTER')
    end

    it 'should fail if the departments are invalid' do
        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            departments: "[-1,-2,99]"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_DEPARTMENT_FILTER')
    end

    it 'should fail if the authors are invalid' do
        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            authors: "[{id:30001, staff: 1},{id:30,staff: 3}]"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_AUTHOR_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            authors: "[{id:'delete all)', staff: 1},{id:30,staff: 3}]"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_AUTHOR_FILTER')
    end

    it 'should fail if the assigned value is invalid' do
        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            assigned: 3
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_ASSIGNED_FILTER')
    end

    it 'should fail if the assigned value is invalid' do
        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            assigned: 11113
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_ASSIGNED_FILTER')
    end

    it 'should fail if the orderBy values are invalid' do
        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            orderBy: "{value: 'closeddd', asc: 11}"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_ORDER_BY')
    end
end
