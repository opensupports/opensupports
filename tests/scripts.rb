class Scripts
    def self.createUser(email = 'steve@jobs.com', password = 'custompassword', name = 'steve jobs')
        response = request('/user/signup', {
            :name => name,
            :email => email,
            :password => password
        })

        if response['status'] === 'fail'
            raise 'Could not create user'
        end
        userRow = $database.getRow('user', email, 'email')
        response = request('/user/verify', {
                :email => email,
                :token => userRow['verification_token']
        })
    end

    def self.login(email = 'steve@jobs.com', password = 'custompassword', staff = false)
        request('/user/logout')
        response = request('/user/login', {
            :email => email,
            :password => password,
            :staff => staff
        })

        if response['data'].any?
            $csrf_userid = response['data']['userId']
            $csrf_token = response['data']['token']
        end

        response['data']
    end

    def self.createTicket()
        result = request('/ticket/create', {
            title: 'Winter is coming',
            content: 'The north remembers',
            departmentId: 1,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        result['data']
    end
end
