describe '/ticket/search' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    result = Scripts.createTicket('test ticket1')
    @ticketNumber1 = result['ticketNumber']

    result = Scripts.createTicket('test ticket2')
    @ticketNumber2 = result['ticketNumber']

    result = Scripts.createTicket('test ticket3')
    @ticketNumber3 = result['ticketNumber']

    $pages = 1..10

    it 'should fail if the page is invalid' do
        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: -1
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_PAGE')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: "-1"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_PAGE')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: "one"
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

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            tags: "[-1]"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_TAG_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            tags: "this is not a tag id list"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_TAG_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            tags: 2
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_TAG_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            tags: '{tags: "[2,3]"}'
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

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            closed: -1
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_CLOSED_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            closed: "-1"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_CLOSED_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            closed: "&123"
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

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            unreadStaff: "hola"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_UNREAD_STAFF_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            unreadStaff: -1
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_UNREAD_STAFF_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            unreadStaff: {unreadStaff: 1}
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_UNREAD_STAFF_FILTER')
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

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            dateRange: "[startDate,endDate]"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_DATE_RANGE_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            dateRange: "[500,123]"
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

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            departments: "1"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_DEPARTMENT_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            departments: "departmentId1"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_DEPARTMENT_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            departments: ""
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

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            authors: "1, 2, 3"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_AUTHOR_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            authors: "[1, 2, 3]"
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

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            assigned: 11113
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_ASSIGNED_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            assigned: "[1]"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_ASSIGNED_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            assigned: "assigned?"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_ASSIGNED_FILTER')
    end

    it 'should fail if the owners are invalid' do
        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            owners: "[{id: 1}]"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_OWNER_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            owners: "[30, 25]"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_OWNER_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            owners: "ownerList"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_OWNER_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            owners: -1
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_OWNER_FILTER')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            owners: "{1, 3}"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_OWNER_FILTER')
    end

    it 'should success if the owners are valid' do
        ownerId1 = 8
        ownerId2 = 1
        ownerId3 = 2

        ownerIdList1 = [ownerId1].to_json
        ownerIdList2 = [ownerId2, ownerId3, ownerId1].to_json
        ownerIdList3 = [ownerId3, ownerId1].to_json

        ownerId1 = ownerId1.to_s
        ownerId2 = ownerId2.to_s
        ownerId3 = ownerId3.to_s

        for page in $pages
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                owners: ownerIdList1
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']

            for ticket in tickets
                (ticket['owner']['id']).should.equal(ownerId1)
            end

            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                owners: ownerIdList2
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']

            for ticket in tickets
                ticketOwnerId = ticket['owner']['id']
                if ticketOwnerId === ownerId1
                    ticketOwnerId.should.equal(ownerId1)
                elsif ticketOwnerId === ownerId2
                    ticketOwnerId.should.equal(ownerId2)
                elsif ticketOwnerId === ownerId3
                    ticketOwnerId.should.equal(ownerId3)
                else
                    1.should.equal(0)
                end
            end

            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                owners: ownerIdList3
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']

            for ticket in tickets
                ticketOwnerId = ticket['owner']['id']
                if ticketOwnerId === ownerId1
                    ticketOwnerId.should.equal(ownerId1)
                elsif ticketOwnerId === ownerId3
                    ticketOwnerId.should.equal(ownerId3)
                else
                    1.should.equal(0)
                end
            end
        end
    end

    it 'should success if the closed value is valid' do
        for page in $pages
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                closed: 1
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']

            for ticket in tickets
                (ticket['closed']).should.equal(true)
            end

            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                closed: 0
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']

            for ticket in tickets
                (ticket['closed']).should.equal(false)
            end
        end
    end

    it 'should success if the page is valid' do
        for page in $pages
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page
            })
            (result['status']).should.equal('success')
        end
    end

    it 'should success if the tags are valid' do
        result = request('/ticket/get-tags', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        tags = result['data']

        for tag in tags
            if tag['id'] === "2"
                tagNameOfId2 = tag['name']
            end
            if tag['id'] === "3"
                tagNameOfId3 = tag['name']
            end
        end

        result = request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 2,
            ticketNumber: @ticketNumber1
        })
        (result['status']).should.equal('success')

        result = request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 3,
            ticketNumber: @ticketNumber2
        })
        (result['status']).should.equal('success')

        result = request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 2,
            ticketNumber: @ticketNumber3
        })
        (result['status']).should.equal('success')

        result = request('/ticket/add-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 3,
            ticketNumber: @ticketNumber3
        })
        (result['status']).should.equal('success')


        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            tags: "[2]"
        })
        (result['status']).should.equal('success')

        tickets = result['data']['tickets']

        (tickets.length()).should.equal(2)

        for ticket in tickets
            if ticket['tags'].length() === 2
                (ticket['tags']).should.equal([tagNameOfId2, tagNameOfId3])
            else
                (ticket['tags']).should.equal([tagNameOfId2])
            end
        end


        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            tags: "[3]"
        })
        (result['status']).should.equal('success')

        tickets = result['data']['tickets']
        (tickets.length()).should.equal(2)

        for ticket in tickets
            if ticket['tags'].length() === 2
                (ticket['tags']).should.equal([tagNameOfId2, tagNameOfId3])
            else
                (ticket['tags']).should.equal([tagNameOfId3])
            end
        end


        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            tags: "[2, 3]"
        })
        (result['status']).should.equal('success')

        for ticket in tickets
            if ticket['tags'].length() === 2
                (ticket['tags']).should.equal([tagNameOfId2, tagNameOfId3])
            elsif ticket['tags'] === [tagNameOfId3]
                (ticket['tags']).should.equal([tagNameOfId3])
            elsif ticket['tags'] === [tagNameOfId2]
                (ticket['tags']).should.equal([tagNameOfId2])
            else
                1.shoul.equal(0)
            end
        end
    end

    it 'should success if the departments are valid' do
        for page in $pages
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                departments: "[1]"
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']

            for ticket in tickets
                (ticket['department']['id']).should.equal('1')
            end
        end
    end

    it 'should success if the authors are valid' do
        authorId1 = 1
        authorId2 = 1
        authorId3 = 1

        authorIsStaff1 = 1
        authorIsStaff2 = 1
        authorIsStaff3 = 0

        authorsFilter1 = [{"id": authorId1, "isStaff": authorIsStaff1}]
        authorsFilter2 = [{"id": authorId2, "isStaff": authorIsStaff2}, {"id": authorId3, "isStaff": authorId3}, {"id": authorId1, "isStaff": authorIsStaff1}]
        authorsFilter3 = []


        authorId1 = authorId1.to_s
        authorId2 = authorId2.to_s
        authorId3 = authorId3.to_s

        authorIsStaff1 = authorIsStaff1 === 1
        authorIsStaff2 = authorIsStaff2 === 1
        authorIsStaff3 = authorIsStaff3 === 1

        authorsFilter1 = authorsFilter1.to_json
        authorsFilter2 = authorsFilter2.to_json

        for page in $pages
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                authors: authorsFilter1
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']

            for ticket in tickets
                ticketAuthor = ticket['author']
                (ticketAuthor['id']).should.equal(authorId1)
                (ticketAuthor['staff']).should.equal(authorIsStaff1)
            end

            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                authors: authorsFilter1
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']

            for ticket in tickets
                ticketAuthor = ticket['author']
                ticketAuthorId = ticketAuthor['id']

                if ticketAuthorId === authorId1
                    (ticketAuthor['id']).should.equal(authorId1)
                    (ticketAuthor['staff']).should.equal(authorIsStaff1)
                elsif ticketAuthorId === authorId2
                    (ticketAuthor['id']).should.equal(authorId2)
                    (ticketAuthor['staff']).should.equal(authorIsStaff2)
                elsif ticketAuthorId === authorId3
                    (ticketAuthor['id']).should.equal(authorId3)
                    (ticketAuthor['staff']).should.equal(authorIsStaff3)
                else
                    1.shoul.equal(0)
                end
            end

            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                authors: authorsFilter3
            })
            (result['status']).should.equal('success')
        end
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

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            orderBy: ""
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_ORDER_BY')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            orderBy: "orderBy"
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_ORDER_BY')

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            orderBy: -1
        })
        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_ORDER_BY')
    end

    it 'should success if the unreadStaff value is valid' do
        unreadStaffNumber1 = 1
        unreadStaffNumber2 = 0

        unreadStaffBool1 = unreadStaffNumber1 === 1
        unreadStaffBool2 = unreadStaffNumber2 === 1

        for page in $pages
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                unreadStaff: unreadStaffNumber1
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']

            for ticket in tickets
                ticket['unreadStaff'].should.equal(unreadStaffBool1)
            end

            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                unreadStaff: unreadStaffNumber2
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']

            for ticket in tickets
                ticket['unreadStaff'].should.equal(unreadStaffBool2)
            end
        end
    end

    it 'should success if the assigned value is valid' do
        assignedNumber1 = 1
        assignedNumber2 = 0

        assignedBool1 = assignedNumber1 === 1
        assignedBool2 = assignedNumber2 === 1

        for page in $pages
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                assigned: assignedNumber1
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']

            for ticket in tickets
                (ticket['owner'] != nil).should.equal(assignedBool1)
            end

            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                assigned: assignedNumber2
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']

            for ticket in tickets
                (ticket['owner'] != nil).should.equal(assignedBool2)
            end
        end
    end

    it 'should fail if the dateRange values are valid' do
        for page in $pages
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                dateRange: "[0,1]"
            })
            (result['status']).should.equal('success')

            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                dateRange: "[201701010000,202001081735]"
            })
            (result['status']).should.equal('success')

            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                dateRange: "[201701010000,201701010001]"
            })
            (result['status']).should.equal('success')
        end
    end

    it 'should fail if the orderBy values are invalid' do
        orderByClosedDesc = {value: 'closed', asc: 0}.to_json
        orderByClosedAsc = {value: 'closed', asc: 1}.to_json

        orderByOwnerIdDesc = {value: 'owner_id', asc: 0}.to_json
        orderByOwnerIdAsc = {value: 'owner_id', asc: 1}.to_json

        for page in $pages
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                orderBy: orderByClosedDesc
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']
            currentTicketClosedValue = (tickets != []) ? ((tickets.first())['closed'] ? 1 : 0) : nil

            for ticket in tickets
                ((ticket['closed'] ? 1 : 0) <= currentTicketClosedValue).should.equal(true)
                currentTicketClosedValue = ticket['closed'] ? 1 : 0
            end

            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                orderBy: orderByClosedAsc
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']
            currentTicketClosedValue = (tickets != []) ? ((tickets.first())['closed'] ? 1 : 0) : nil

            for ticket in tickets
                ((ticket['closed'] ? 1 : 0) >= currentTicketClosedValue).should.equal(true)
                currentTicketClosedValue = ticket['closed'] ? 1 : 0
            end

            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                orderBy: orderByOwnerIdDesc
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']
            firstTicket = tickets.first()
            firstTicketOwner = firstTicket ? firstTicket['owner'] : nil
            firstTicketOwnerId = firstTicketOwner ? firstTicketOwner['id'] : "-1"
            currentTicketOwnerIdValue = (tickets != []) ? firstTicketOwnerId: nil

            for ticket in tickets
                ticketOwner = ticket['owner']
                ticketOwnerId = ticketOwner ? ticketOwner['id'] : "-1"

                (ticketOwnerId <= currentTicketOwnerIdValue).should.equal(true)

                currentTicketOwnerIdValue = ticketOwnerId
            end

            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: page,
                orderBy: orderByOwnerIdAsc
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']
            firstTicket = tickets.first()
            firstTicketOwner = firstTicket ? firstTicket['owner'] : nil
            firstTicketOwnerId = firstTicketOwner ? firstTicketOwner['id'] : "-1"
            currentTicketOwnerIdValue = (tickets != []) ? firstTicketOwnerId: nil

            for ticket in tickets
                ticketOwner = ticket['owner']
                ticketOwnerId = ticketOwner ? ticketOwner['id'] : "-1"

                (ticketOwnerId >= currentTicketOwnerIdValue).should.equal(true)

                currentTicketOwnerIdValue = ticketOwnerId
            end
        end
    end
end
