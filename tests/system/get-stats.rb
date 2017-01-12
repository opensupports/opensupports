describe'/system/get-stats' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    it 'should get stats' do

        d = Date.today.prev_day
        yesterday = d.strftime("%Y%m%d%H%M")
        d = Date.today.prev_day.prev_day
        yesterday2 = d.strftime("%Y%m%d%H%M")
        d = Date.today.prev_day.prev_day.prev_day
        yesterday3 = d.strftime("%Y%m%d%H%M")

        #day 1
        for i in 0..5
            $database.query("INSERT INTO log VALUES('', 'SIGNUP', NULL, " + yesterday3 + ", NULL, NULL);")
        end
        for i in 0..0
            $database.query("INSERT INTO log VALUES('', 'CREATE_TICKET', NULL, " + yesterday3 + ", NULL, NULL);")
        end
        for i in 0..1
            $database.query("INSERT INTO log VALUES('', 'CLOSE', NULL, " + yesterday3 + ", NULL, NULL);")
        end
        for i in 0..2
            $database.query("INSERT INTO log VALUES('', 'COMMENT', NULL, " + yesterday3 + ", NULL, NULL);")
        end
        for i in 0..8
            $database.query("INSERT INTO ticketevent VALUES('', 'CLOSE', NULL, " + yesterday3 + ", NULL, NULL, 1);")
        end
        for i in 0..4
            $database.query("INSERT INTO ticketevent VALUES('', 'ASSIGN', NULL, " + yesterday3 + ", NULL, NULL, 1);")
        end

        #day 2
        for i in 0..7
            $database.query("INSERT INTO log VALUES('', 'SIGNUP', NULL, " + yesterday2 + ", NULL, NULL);")
        end
        for i in 0..2
            $database.query("INSERT INTO log VALUES('', 'CREATE_TICKET', NULL, " + yesterday2 + ", NULL, NULL);")
        end
        for i in 0..9
            $database.query("INSERT INTO log VALUES('', 'CLOSE', NULL, " + yesterday2 + ", NULL, NULL);")
        end
        for i in 0..2
            $database.query("INSERT INTO log VALUES('', 'COMMENT', NULL, " + yesterday2 + ", NULL, NULL);")
        end
        for i in 0..10
            $database.query("INSERT INTO ticketevent VALUES('', 'CLOSE', NULL, " + yesterday2 + ", NULL, NULL, 1);")
        end
        for i in 0..2
            $database.query("INSERT INTO ticketevent VALUES('', 'ASSIGN', NULL, " + yesterday2 + ", NULL, NULL, 1);")
        end

        #day 3
        for i in 0..0
            $database.query("INSERT INTO log VALUES('', 'SIGNUP', NULL, " + yesterday + ", NULL, NULL);")
        end
        for i in 0..1
            $database.query("INSERT INTO log VALUES('', 'CREATE_TICKET', NULL, " + yesterday + ", NULL, NULL);")
        end
        for i in 0..4
            $database.query("INSERT INTO log VALUES('', 'CLOSE', NULL, " + yesterday + ", NULL, NULL);")
        end
        for i in 0..7
            $database.query("INSERT INTO log VALUES('', 'COMMENT', NULL, " + yesterday + ", NULL, NULL);")
        end
        for i in 0..3
            $database.query("INSERT INTO ticketevent VALUES('', 'CLOSE', NULL, " + yesterday + ", NULL, NULL, 1);")
        end
        for i in 0..7
            $database.query("INSERT INTO ticketevent VALUES('', 'ASSIGN', NULL, " + yesterday + ", NULL, NULL, 1);")
        end

        @result = request('/system/get-stats', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            period: 'week'
        })

        def assertData(position, date, type, value)
            (@result['data'][position]['date']).should.equal(date)
            (@result['data'][position]['type']).should.equal(type)
            (@result['data'][position]['value']).should.equal(value)
        end

        assertData(11, '20170109', 'CREATE_TICKET', '1')
        assertData(10, '20170109', 'CLOSE', '2')
        assertData(9, '20170109', 'SIGNUP', '6')
        assertData(8, '20170109', 'COMMENT', '3')


        assertData(7, '20170110', 'CREATE_TICKET', '3')
        assertData(6, '20170110', 'CLOSE', '10')
        assertData(5, '20170110', 'SIGNUP', '8')
        assertData(4, '20170110', 'COMMENT', '3')

        assertData(3, '20170111', 'CREATE_TICKET', '2')
        assertData(2, '20170111', 'CLOSE', '5')
        assertData(1, '20170111', 'SIGNUP', '1')
        assertData(0, '20170111', 'COMMENT', '8')


        @result = request('/system/get-stats', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            period: 'week',
            staffId: '1'
        })
        assertData(0, '20170111', 'CLOSE', '4')
        assertData(1, '20170111', 'ASSIGN', '8')
        assertData(2, '20170110', 'CLOSE', '11')
        assertData(3, '20170110', 'ASSIGN', '3')

        assertData(4, '20170109', 'CLOSE', '9')
        assertData(5, '20170109', 'ASSIGN', '5')
        assertData(6, '20170108', 'CLOSE', '0')
        assertData(7, '20170108', 'ASSIGN', '0')

        assertData(8, '20170107', 'CLOSE', '0')
        assertData(9, '20170107', 'ASSIGN', '0')
        assertData(10, '20170106', 'CLOSE', '0')
        assertData(11, '20170106', 'ASSIGN', '0')

        assertData(12, '20170105', 'CLOSE', '0')
        assertData(13, '20170105', 'ASSIGN', '0')
        assertData(14, '20170104', 'CLOSE', '0')
        assertData(15, '20170104', 'ASSIGN', '0')

        assertData(16, '20170103', 'CLOSE', '0')
        assertData(17, '20170103', 'ASSIGN', '0')
        assertData(18, '20170102', 'CLOSE', '0')
        assertData(19, '20170102', 'ASSIGN', '0')

        assertData(20, '20170101', 'CLOSE', '0')
        assertData(21, '20170101', 'ASSIGN', '0')
    end
end
