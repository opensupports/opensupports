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

        result= request('/system/get-stats', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            period: 'week'
        })

        (result['status']).should.equal('success')

        row = $database.getRow('stat', 65, 'id')

        (row['date']).should.equal('20170109')
        (row['type']).should.equal('CREATE_TICKET')
        (row['general']).should.equal('1')
        (row['value']).should.equal('1')

        row = $database.getRow('stat', 66, 'id')

        (row['date']).should.equal('20170109')
        (row['type']).should.equal('CLOSE')
        (row['general']).should.equal('1')
        (row['value']).should.equal('2')

        row = $database.getRow('stat', 67, 'id')

        (row['date']).should.equal('20170109')
        (row['type']).should.equal('SIGNUP')
        (row['general']).should.equal('1')
        (row['value']).should.equal('6')

        row = $database.getRow('stat', 68, 'id')

        (row['date']).should.equal('20170109')
        (row['type']).should.equal('COMMENT')
        (row['general']).should.equal('1')
        (row['value']).should.equal('3')

        row = $database.getRow('stat', 69, 'id')

        (row['date']).should.equal('20170109')
        (row['type']).should.equal('ASSIGN')
        (row['general']).should.equal('0')
        (row['value']).should.equal('5')

        row = $database.getRow('stat', 70, 'id')

        (row['date']).should.equal('20170109')
        (row['type']).should.equal('CLOSE')
        (row['general']).should.equal('0')
        (row['value']).should.equal('9')

        row = $database.getRow('stat', 71, 'id')

        (row['date']).should.equal('20170109')
        (row['type']).should.equal('ASSIGN')
        (row['general']).should.equal('0')
        (row['value']).should.equal('0')

        row = $database.getRow('stat', 72, 'id')

        (row['date']).should.equal('20170109')
        (row['type']).should.equal('CLOSE')
        (row['general']).should.equal('0')
        (row['value']).should.equal('0')

        row = $database.getRow('stat', 73, 'id')

        (row['date']).should.equal('20170110')
        (row['type']).should.equal('CREATE_TICKET')
        (row['general']).should.equal('1')
        (row['value']).should.equal('3')

        row = $database.getRow('stat', 74, 'id')

        (row['date']).should.equal('20170110')
        (row['type']).should.equal('CLOSE')
        (row['general']).should.equal('1')
        (row['value']).should.equal('10')

        row = $database.getRow('stat', 75, 'id')

        (row['date']).should.equal('20170110')
        (row['type']).should.equal('SIGNUP')
        (row['general']).should.equal('1')
        (row['value']).should.equal('8')

        row = $database.getRow('stat', 76, 'id')

        (row['date']).should.equal('20170110')
        (row['type']).should.equal('COMMENT')
        (row['general']).should.equal('1')
        (row['value']).should.equal('3')

        row = $database.getRow('stat', 77, 'id')

        (row['date']).should.equal('20170110')
        (row['type']).should.equal('ASSIGN')
        (row['general']).should.equal('0')
        (row['value']).should.equal('3')

        row = $database.getRow('stat', 78, 'id')

        (row['date']).should.equal('20170110')
        (row['type']).should.equal('CLOSE')
        (row['general']).should.equal('0')
        (row['value']).should.equal('11')

        row = $database.getRow('stat', 79, 'id')

        (row['date']).should.equal('20170110')
        (row['type']).should.equal('ASSIGN')
        (row['general']).should.equal('0')
        (row['value']).should.equal('0')

        row = $database.getRow('stat', 80, 'id')

        (row['date']).should.equal('20170110')
        (row['type']).should.equal('CLOSE')
        (row['general']).should.equal('0')
        (row['value']).should.equal('0')

        row = $database.getRow('stat', 81, 'id')

        (row['date']).should.equal('20170111')
        (row['type']).should.equal('CREATE_TICKET')
        (row['general']).should.equal('1')
        (row['value']).should.equal('2')

        row = $database.getRow('stat', 82, 'id')

        (row['date']).should.equal('20170111')
        (row['type']).should.equal('CLOSE')
        (row['general']).should.equal('1')
        (row['value']).should.equal('5')

        row = $database.getRow('stat', 83, 'id')

        (row['date']).should.equal('20170111')
        (row['type']).should.equal('SIGNUP')
        (row['general']).should.equal('1')
        (row['value']).should.equal('1')

        row = $database.getRow('stat', 84, 'id')

        (row['date']).should.equal('20170111')
        (row['type']).should.equal('COMMENT')
        (row['general']).should.equal('1')
        (row['value']).should.equal('8')

        row = $database.getRow('stat', 85, 'id')

        (row['date']).should.equal('20170111')
        (row['type']).should.equal('ASSIGN')
        (row['general']).should.equal('0')
        (row['value']).should.equal('8')

        row = $database.getRow('stat', 86, 'id')

        (row['date']).should.equal('20170111')
        (row['type']).should.equal('CLOSE')
        (row['general']).should.equal('0')
        (row['value']).should.equal('4')

        row = $database.getRow('stat', 87, 'id')

        (row['date']).should.equal('20170111')
        (row['type']).should.equal('ASSIGN')
        (row['general']).should.equal('0')
        (row['value']).should.equal('0')

        row = $database.getRow('stat', 88, 'id')

        (row['date']).should.equal('20170111')
        (row['type']).should.equal('CLOSE')
        (row['general']).should.equal('0')
        (row['value']).should.equal('0')
    end
end
