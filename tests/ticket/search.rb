describe '/ticket/search' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    Scripts.createTicket('test ticket1')
    @ticketNumber1 = $database.getRow('ticket', 'test ticket1', 'title')['ticket_number']

    Scripts.createTicket('test ticket2')
    @ticketNumber2 = $database.getRow('ticket', 'test ticket2', 'title')['ticket_number']

    Scripts.createTicket('test ticket3')
    @ticketNumber3 = $database.getRow('ticket', 'test ticket3', 'title')['ticket_number']

    $pages = 1..10

    it 'should fail if the page is invalid' do
        pageFilterList = [-1, '-1', 'one']

        for pageFilter in pageFilterList
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: pageFilter
            })
            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_PAGE')
        end
    end

    it 'should fail if the tags are invalid' do
        tagsFilterList = [
            '[1, 11, 111, 1111, 11111, 111111, 1111111, 11111111]',
            '[-1]',
            'this is not a tag id list',
            2,
            '{tags: "[2, 3]"}'
        ]

        for tagsFilter in tagsFilterList
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: 1,
                tags: tagsFilter
            })
            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_TAG_FILTER')
        end
    end

    it 'should fail if the closed value is invalid' do
        closedFilterList = [3, -1, '-1', '&123']

        for closedFilter in closedFilterList
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: 1,
                closed: closedFilter
            })
            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_CLOSED_FILTER')
        end
    end

    it 'should fail if the unreadStaff value is invalid' do
        unreadStaffFilterList = [3, 'hola', -1, {unreadStaff: 1}]

        for unreadStaffFilter in unreadStaffFilterList
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: 1,
                unreadStaff: unreadStaffFilter
            })
            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_UNREAD_STAFF_FILTER')
        end
    end

    it 'should fail if the dateRange values are invalid' do
        dateRangeFilterList = ['[11, 69, ())]', '[startDate, endDate]', '[500, 123]']

        for dateRangeFilter in dateRangeFilterList
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: 1,
                dateRange: dateRangeFilter
            })
            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_DATE_RANGE_FILTER')
        end
    end

    it 'should fail if the departments are invalid' do
        departmentFilterList = ['[-1,-2,99]', '1', 'departmentId1', '']

        for departmentFilter in departmentFilterList
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: 1,
                departments: departmentFilter
            })
            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_DEPARTMENT_FILTER')
        end
    end

    it 'should fail if the authors are invalid' do
        authorsFilterList = [
            '[{id:30001, staff: 1},{id:30,staff: 3}]',
            '[{id:"delete all)", staff: 1},{id:30,staff: 3}]',
            '1, 2, 3',
            '[1, 2, 3]'
        ]

        for authorsFilter in authorsFilterList
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: 1,
                authors: authorsFilter
            })
            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_AUTHOR_FILTER')
        end
    end

    it 'should fail if the assigned value is invalid' do
        assignedFilterList = [3, 11113, '[1]', 'assigned?']

        for assignedFilter in assignedFilterList
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: 1,
                assigned: assignedFilter
            })
            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_ASSIGNED_FILTER')
        end
    end

    it 'should fail if the owners are invalid' do
        ownersFilterList = ['[{id: 1}]', '[30, 25]', 'ownerList', -1, '{1, 3}']

        for ownersFilter in ownersFilterList
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: 1,
                owners: ownersFilter
            })
            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_OWNER_FILTER')
        end
    end

    it 'should get tickets from the owner passaged' do
        ownerIdList = [8, 1, 2]
        ownerIdFilterList = [
            [ownerIdList[0]],
            [ownerIdList[1], ownerIdList[2], ownerIdList[0]],
            [ownerIdList[2], ownerIdList[0]]
        ]
        ownerIdFilterList = ownerIdFilterList.map { |ownerFilter| ownerFilter.to_json }

        for page in $pages
            for ownerFilter in ownerIdFilterList
                result = request('/ticket/search', {
                    csrf_userid: $csrf_userid,
                    csrf_token: $csrf_token,
                    page: page,
                    owners: ownerFilter
                })
                (result['status']).should.equal('success')

                tickets = result['data']['tickets']

                for ticket in tickets
                    (ownerFilter.include?(ticket['owner']['id'])).should.equal(true)
                end
            end
        end
    end

    it 'should get tickets from the closed passaged' do
        closedFilterList = [1, 0]

        for page in $pages
            for closedFilter in closedFilterList
                result = request('/ticket/search', {
                    csrf_userid: $csrf_userid,
                    csrf_token: $csrf_token,
                    page: page,
                    closed: closedFilter
                })
                (result['status']).should.equal('success')

                tickets = result['data']['tickets']

                for ticket in tickets
                    (ticket['closed']).should.equal(closedFilter === 1)
                end
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

    it 'should get tickets from the tags passaged' do
        ticketNumberList1 = [@ticketNumber1, @ticketNumber3]
        ticketNumberList2 = [@ticketNumber2, @ticketNumber3]

        result = request('/ticket/get-tags', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
        (result['status']).should.equal('success')

        tags = result['data']

        for tag in tags
            if tag['id'] === '2'
                tagNameOfId2 = tag['name']
            end
            if tag['id'] === '3'
                tagNameOfId3 = tag['name']
            end
        end

        for ticketNumber in ticketNumberList1
            result = request('/ticket/add-tag', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                tagId: 2,
                ticketNumber: ticketNumber
            })
            (result['status']).should.equal('success')
        end

        for ticketNumber in ticketNumberList2
            result = request('/ticket/add-tag', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                tagId: 3,
                ticketNumber: ticketNumber
            })
            (result['status']).should.equal('success')
        end

        tagObjectList = [
            {'tagIdFilter' => '[2]', 'tagName' => tagNameOfId2},
            {'tagIdFilter' => '[3]', 'tagName' => tagNameOfId3},
        ]

        for tagObject in tagObjectList
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: 1,
                tags: tagObject['tagIdFilter']
            })
            (result['status']).should.equal('success')

            tickets = result['data']['tickets']

            for ticket in tickets
                ticketTags = ticket['tags']
                (ticketTags.include?(tagObject['tagName'])).should.equal(true)
            end
        end

        result = request('/ticket/search', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            page: 1,
            tags: '[2, 3]'
        })
        (result['status']).should.equal('success')

        for ticket in tickets
            ticketTags = ticket['tags']
            (
                (ticketTags.include?(tagNameOfId2) && ticketTags.include?(tagNameOfId3)) ||
                ticketTags.include?(tagNameOfId3) ||
                ticketTags.include?(tagNameOfId2)
            ).should.equal(true)
        end
    end

    it 'should get tickets from the departments passaged' do
        departmentIdList = [1, 2, 7]
        departmentIdFilterList = [
            [departmentIdList[0]],
            [departmentIdList[1]],
            [departmentIdList[1], departmentIdList[0], departmentIdList[2]]
        ]
        departmentIdFilterList = departmentIdFilterList.map { |departmentFilter| departmentFilter.to_json }

        for page in $pages
            for departmentFilter in departmentIdFilterList
                result = request('/ticket/search', {
                    csrf_userid: $csrf_userid,
                    csrf_token: $csrf_token,
                    page: page,
                    departments: departmentFilter
                })
                (result['status']).should.equal('success')

                tickets = result['data']['tickets']

                for ticket in tickets
                    (departmentFilter.include?(ticket['department']['id'])).should.equal(true)
                end
            end
        end
    end

    it 'should get tickets from the authors passaged' do
        authorIdList = [1, 2, 8]
        authorIsStaffList = [true, true, false]
        authorsFilterList = [
            [],
            [{'id' => authorIdList[0], 'isStaff' => authorIsStaffList[0]}],
            [
                {'id' => authorIdList[1], 'isStaff' => authorIsStaffList[1]},
                {'id' => authorIdList[2], 'isStaff' => authorIsStaffList[2]},
                {'id' => authorIdList[0], 'isStaff' => authorIsStaffList[0]}
            ]
        ]
        authorsFilterList = authorsFilterList.map { |authorsFilter| authorsFilter.to_json }
        authorIdList = authorIdList.map { |authorId| authorId.to_s }

        for page in $pages
            for authorsFilter in authorsFilterList
                result = request('/ticket/search', {
                    csrf_userid: $csrf_userid,
                    csrf_token: $csrf_token,
                    page: page,
                    authors: authorsFilter
                })
                (result['status']).should.equal('success')

                if authorsFilter != '[]'
                    tickets = result['data']['tickets']

                    for ticket in tickets
                        ticketAuthor = ticket['author']
                        author = (JSON.parse(authorsFilter)).find { |author| author['id'].to_s === ticketAuthor['id'] }
                        (author['isStaff']).should.equal(ticketAuthor['staff'])
                    end
                end
            end
        end
    end

    it 'should fail if the orderBy values are invalid' do
        orderByFilterList = ['{value: "closeddd", asc: 11}', '', 'orderBy', -1]

        for orderByFilter in orderByFilterList
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: 1,
                orderBy: orderByFilter
            })
            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_ORDER_BY')
        end
    end

    it 'should get tickets from the unreadStaff passaged' do
        unreadStaffList = [1, 0]

        for page in $pages
            for unreadStaff in unreadStaffList
                result = request('/ticket/search', {
                    csrf_userid: $csrf_userid,
                    csrf_token: $csrf_token,
                    page: page,
                    unreadStaff: unreadStaff
                })
                (result['status']).should.equal('success')

                tickets = result['data']['tickets']

                for ticket in tickets
                    ticket['unreadStaff'].should.equal(unreadStaff === 1)
                end
            end
        end
    end

    it 'should get tickets from the assigned passaged' do
        assignedFilterList = [1, 0]

        for page in $pages
            for assignedFilter in assignedFilterList
                result = request('/ticket/search', {
                    csrf_userid: $csrf_userid,
                    csrf_token: $csrf_token,
                    page: page,
                    assigned: assignedFilter
                })
                (result['status']).should.equal('success')

                tickets = result['data']['tickets']

                for ticket in tickets
                    (ticket['owner'] != nil).should.equal(assignedFilter === 1)
                end
            end
        end
    end

    it 'should success if the dateRange values are valid' do
        dateRangeList = [[0, 1], [201701010000,202001081735], [201701010000,201701010001]]

        dateRangeFilterList = dateRangeList.map { |dateRange| dateRange.to_json }

        for page in $pages
            for dateRangeFilter in dateRangeFilterList
                result = request('/ticket/search', {
                    csrf_userid: $csrf_userid,
                    csrf_token: $csrf_token,
                    page: page,
                    dateRange: dateRangeFilter
                })
                (result['status']).should.equal('success')
            end
        end
    end

    it 'should get tickets from the orderBy passaged' do
        orderByClosedDesc = '{"value": "closed", "asc": 0}'
        orderByClosedAsc = '{"value": "closed", "asc": 1}'

        orderByOwnerIdDesc = '{"value": "owner_id", "asc": 0}'
        orderByOwnerIdAsc = '{"value": "owner_id", "asc": 1}'

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
                ticketStatus = ticket['closed']
                ((ticketStatus ? 1 : 0) <= currentTicketClosedValue).should.equal(true)
                currentTicketClosedValue = ticketStatus ? 1 : 0
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
                ticketStatus = ticket['closed']
                ((ticketStatus ? 1 : 0) >= currentTicketClosedValue).should.equal(true)
                currentTicketClosedValue = ticketStatus ? 1 : 0
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
            firstTicketOwnerId = firstTicketOwner ? firstTicketOwner['id'] : '-1'
            currentTicketOwnerIdValue = (tickets != []) ? firstTicketOwnerId: nil

            for ticket in tickets
                ticketOwner = ticket['owner']
                ticketOwnerId = ticketOwner ? ticketOwner['id'] : '-1'

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
            firstTicketOwnerId = firstTicketOwner ? firstTicketOwner['id'] : '-1'
            currentTicketOwnerIdValue = (tickets != []) ? firstTicketOwnerId: nil

            for ticket in tickets
                ticketOwner = ticket['owner']
                ticketOwnerId = ticketOwner ? ticketOwner['id'] : '-1'

                (ticketOwnerId >= currentTicketOwnerIdValue).should.equal(true)

                currentTicketOwnerIdValue = ticketOwnerId
            end
        end
    end

    it 'should fail if the query values are invalid' do
        queryList = ['', '  ', '   ']

        for page in $pages
            for query in queryList
                result = request('/ticket/search', {
                    csrf_userid: $csrf_userid,
                    csrf_token: $csrf_token,
                    page: page,
                    query: query
                })
                (result['status']).should.equal('fail')
            end
        end
    end

    #
    # it 'should success if the query values are valid' do
    #     queryList = ['Hola?', '223121', '1', 'xD']

    #     for page in $pages
    #         for query in queryList
    #             result = request('/ticket/search', {
    #                 csrf_userid: $csrf_userid,
    #                 csrf_token: $csrf_token,
    #                 page: page,
    #                 query: query
    #             })
    #             if result['status'] === 'fail'
    #                 puts "Esto es result #{result}"
    #             end
                # result is {
                #     "status"=>"fail",
                #     "message"=>"SQLSTATE[42000]: Syntax error or access violation: 1055 Expression #1 of ORDER BY clause is not in GROUP BY clause and contains nonaggregated column 'development.ticketevent.content' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by",
                #     "data"=>nil
                # }
    #             (result['status']).should.equal('success')
    #         end
    #     end
    # end

    it 'should get tickets from the assigned and the author passaged' do
        assignedFilterList = [1, 0]
        authorIdList = [1, 2, 8]
        authorIsStaffList = [true, true, false]
        authorsFilterList = [
            [],
            [{'id' => authorIdList[0], 'isStaff' => authorIsStaffList[0]}],
            [
                {'id' => authorIdList[1], 'isStaff' => authorIsStaffList[1]},
                {'id' => authorIdList[2], 'isStaff' => authorIsStaffList[2]},
                {'id' => authorIdList[0], 'isStaff' => authorIsStaffList[0]}
            ]
        ]
        authorsFilterList = authorsFilterList.map { |authorsFilter| authorsFilter.to_json }
        authorIdList = authorIdList.map { |authorId| authorId.to_s }

        for page in $pages
            for authorsFilter in authorsFilterList
                for assignedFilter in assignedFilterList
                    result = request('/ticket/search', {
                        csrf_userid: $csrf_userid,
                        csrf_token: $csrf_token,
                        page: page,
                        assigned: assignedFilter,
                        authors: authorsFilter
                    })
                    (result['status']).should.equal('success')

                    if authorsFilter != '[]'
                        tickets = result['data']['tickets']

                        for ticket in tickets
                            ticketAuthor = ticket['author']
                            author = (JSON.parse(authorsFilter)).find { |author| author['id'].to_s === ticketAuthor['id'] }
                            (author['isStaff']).should.equal(ticketAuthor['staff'])
                            (ticket['owner'] != nil).should.equal(assignedFilter === 1)
                        end
                    end
                end
            end
        end
    end

    it 'should get tickets from the closed and the owners passaged' do
        closedFilterList = [1, 0]
        ownerIdList = [8, 1, 2]
        ownerIdFilterList = [
            [ownerIdList[0]],
            [ownerIdList[1], ownerIdList[2], ownerIdList[0]],
            [ownerIdList[2], ownerIdList[0]]
        ]
        ownerIdFilterList = ownerIdFilterList.map { |ownerFilter| ownerFilter.to_json }

        for page in $pages
            for ownerFilter in ownerIdFilterList
                for closedFilter in closedFilterList
                    result = request('/ticket/search', {
                        csrf_userid: $csrf_userid,
                        csrf_token: $csrf_token,
                        page: page,
                        closed: closedFilter,
                        owners: ownerFilter
                    })
                    (result['status']).should.equal('success')

                    tickets = result['data']['tickets']

                    for ticket in tickets
                        (ticket['closed']).should.equal(closedFilter === 1)
                        (ownerFilter.include?(ticket['owner']['id'])).should.equal(true)
                    end
                end
            end
        end
    end

    it 'should success if the page size is valid' do
        pageSizeList = [5, 10, 20, 50]

        for pageSize in pageSizeList
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: 1,
                pageSize: pageSize
            })
            (result['status'].should.equal('success'))
        end
    end

    it 'should fail if page size is not among validation options' do
        pageSizeList = [0, 51, 'string', true]

        for pageSize in pageSizeList
            result = request('/ticket/search', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                page: 1,
                pageSize: pageSize
            })
            (result['status'].should.equal('fail'))
            (result['message']).should.equal('INVALID_PAGE_SIZE')
        end
    end
end
