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
            $database.query("INSERT INTO log VALUES(NULL, 'SIGNUP', NULL, " + yesterday3 + ", NULL, NULL, NULL);")
        end
        for i in 0..0
            $database.query("INSERT INTO log VALUES(NULL, 'CREATE_TICKET', NULL, " + yesterday3 + ", NULL, NULL, NULL);")
        end
        for i in 0..1
            $database.query("INSERT INTO log VALUES(NULL, 'CLOSE', NULL, " + yesterday3 + ", NULL, NULL, NULL);")
        end
        for i in 0..2
            $database.query("INSERT INTO log VALUES(NULL, 'COMMENT', NULL, " + yesterday3 + ", NULL, NULL, NULL);")
        end
        for i in 0..8
            $database.query("INSERT INTO ticketevent VALUES(NULL, 'CLOSE', NULL, NULL, " + yesterday3 + ", 0, NULL, NULL, 1);")
        end
        for i in 0..4
            $database.query("INSERT INTO ticketevent VALUES(NULL, 'ASSIGN', NULL, NULL, " + yesterday3 + ", 0, NULL, NULL, 1);")
        end

        #day 2
        for i in 0..7
            $database.query("INSERT INTO log VALUES(NULL, 'SIGNUP', NULL, " + yesterday2 + ", NULL, NULL, NULL);")
        end
        for i in 0..2
            $database.query("INSERT INTO log VALUES(NULL, 'CREATE_TICKET', NULL, " + yesterday2 + ", NULL, NULL, NULL);")
        end
        for i in 0..9
            $database.query("INSERT INTO log VALUES(NULL, 'CLOSE', NULL, " + yesterday2 + ", NULL, NULL, NULL);")
        end
        for i in 0..2
            $database.query("INSERT INTO log VALUES(NULL, 'COMMENT', NULL, " + yesterday2 + ", NULL, NULL, NULL);")
        end
        for i in 0..10
            $database.query("INSERT INTO ticketevent VALUES(NULL, 'CLOSE', NULL, NULL, " + yesterday2 + ", 0, NULL, NULL, 1);")
        end
        for i in 0..2
            $database.query("INSERT INTO ticketevent VALUES(NULL, 'ASSIGN', NULL, NULL, " + yesterday2 + ", 0, NULL, NULL, 1);")
        end

        #day 3
        for i in 0..0
            $database.query("INSERT INTO log VALUES(NULL, 'SIGNUP', NULL, " + yesterday + ", NULL, NULL, NULL);")
        end
        for i in 0..1
            $database.query("INSERT INTO log VALUES(NULL, 'CREATE_TICKET', NULL, " + yesterday + ", NULL, NULL, NULL);")
        end
        for i in 0..4
            $database.query("INSERT INTO log VALUES(NULL, 'CLOSE', NULL, " + yesterday + ", NULL, NULL, NULL);")
        end
        for i in 0..7
            $database.query("INSERT INTO log VALUES(NULL, 'COMMENT', NULL, " + yesterday + ", NULL, NULL, NULL);")
        end
        for i in 0..3
            $database.query("INSERT INTO ticketevent VALUES(NULL, 'CLOSE', NULL, NULL, " + yesterday + ", 0, NULL, NULL, 1);")
        end
        for i in 0..7
            $database.query("INSERT INTO ticketevent VALUES(NULL, 'ASSIGN', NULL, NULL, " + yesterday + ", 0, NULL, NULL, 1);")
        end

        @result = request('/system/get-stats', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            period: 'WEEK'
        })

        def assertData(position, date, type, value)
            (@result['data'][position]['date']).should.equal(date)
            (@result['data'][position]['type']).should.equal(type)
            (@result['data'][position]['value']).should.equal(value)
        end

        d = Date.today.prev_day
        yesterday = d.strftime("%Y%m%d")
        d = Date.today.prev_day(2)
        yesterday2 = d.strftime("%Y%m%d")
        d = Date.today.prev_day(3)
        yesterday3 = d.strftime("%Y%m%d")
        d = Date.today.prev_day(4)
        yesterday4 = d.strftime("%Y%m%d")
        d = Date.today.prev_day(5)
        yesterday5 = d.strftime("%Y%m%d")
        d = Date.today.prev_day(6)
        yesterday6 = d.strftime("%Y%m%d")
        d = Date.today.prev_day(7)
        yesterday7 = d.strftime("%Y%m%d")
        d = Date.today.prev_day(8)
        yesterday8 = d.strftime("%Y%m%d")
        d = Date.today.prev_day(9)
        yesterday9 = d.strftime("%Y%m%d")
        d = Date.today.prev_day(10)
        yesterday10 = d.strftime("%Y%m%d")
        d = Date.today.prev_day(11)
        yesterday11 = d.strftime("%Y%m%d")

        assertData(11, yesterday3, 'CREATE_TICKET', '1')
        assertData(10, yesterday3, 'CLOSE', '2')
        assertData(9, yesterday3, 'SIGNUP', '6')
        assertData(8, yesterday3, 'COMMENT', '3')


        assertData(7, yesterday2, 'CREATE_TICKET', '3')
        assertData(6, yesterday2, 'CLOSE', '10')
        assertData(5, yesterday2, 'SIGNUP', '8')
        assertData(4, yesterday2, 'COMMENT', '3')

        assertData(3, yesterday, 'CREATE_TICKET', '2')
        assertData(2, yesterday, 'CLOSE', '5')
        assertData(1, yesterday, 'SIGNUP', '1')
        assertData(0, yesterday, 'COMMENT', '8')


        @result = request('/system/get-stats', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            period: 'WEEK',
            staffId: '1'
        })
        assertData(0, yesterday, 'CLOSE', '4')
        assertData(1, yesterday, 'ASSIGN', '8')
        assertData(2, yesterday2, 'CLOSE', '11')
        assertData(3, yesterday2, 'ASSIGN', '3')

        assertData(4, yesterday3, 'CLOSE', '9')
        assertData(5, yesterday3, 'ASSIGN', '5')
        assertData(6, yesterday4, 'CLOSE', '0')
        assertData(7, yesterday4, 'ASSIGN', '0')

        assertData(8, yesterday5, 'CLOSE', '0')
        assertData(9, yesterday5, 'ASSIGN', '0')
        assertData(10, yesterday6, 'CLOSE', '0')
        assertData(11, yesterday6, 'ASSIGN', '0')

        assertData(12, yesterday7, 'CLOSE', '0')
        assertData(13, yesterday7, 'ASSIGN', '0')
        assertData(14, yesterday8, 'CLOSE', '0')
        assertData(15, yesterday8, 'ASSIGN', '0')

        assertData(16, yesterday9, 'CLOSE', '0')
        assertData(17, yesterday9, 'ASSIGN', '0')
        assertData(18, yesterday10, 'CLOSE', '0')
        assertData(19, yesterday10, 'ASSIGN', '0')

        assertData(20, yesterday11, 'CLOSE', '0')
        assertData(21, yesterday11, 'ASSIGN', '0')
    end

    it 'should remove very old stats' do
        prev_days_to_remove = 32;

        stats_count = $database.query('SELECT COUNT(*) as qt FROM stat').fetch_hash['qt'];
        date = Date.today.prev_day(prev_days_to_remove).strftime("%Y%m%d");

        $database.query('INSERT INTO stat VALUES(\'\', '+ date +', \'CLOSE\', 1, 0, NULL)');
        $database.query('INSERT INTO stat VALUES(\'\', '+ date +', \'SINGUP\', 1, 0, NULL)');
        $database.query('INSERT INTO stat VALUES(\'\', '+ date +', \'COMMENT\', 1, 0, NULL)');
        stats_count_updated = $database.query('SELECT COUNT(*) as qt FROM stat').fetch_hash['qt'];
        (stats_count).should.not.equal(stats_count_updated)

        request('/system/get-stats', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            period: 'MONTH',
            staffId: '1'
        })
        stats_count_updated = $database.query('SELECT COUNT(*) as qt FROM stat').fetch_hash['qt'];
        (stats_count).should.equal(stats_count_updated)
    end
end
