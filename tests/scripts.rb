class Scripts
    def self.createUser(email = 'steve@jobs.com', password = 'custompassword', name = 'steve jobs')
        response = request('/user/signup', {
            :name => name,
            :email => email,
            :password => password
        })

        if response['status'] === 'fail'
            raise response['message']
        end
        userRow = $database.getRow('user', email, 'email')
        request('/user/verify', {
                :email => email,
                :token => userRow['verification_token']
        })
    end

    def self.createStaff(email, password, name, level='1')
        departments = request('/system/get-settings', {
          csrf_userid: $csrf_userid,
          csrf_token: $csrf_token
        })['data']['departments']
        departments = departments.collect  { |x| x.id }

        response = request('/staff/add', {
            :name => name,
            :email => email,
            :password => password,
            :level => level,
            :departments => departments.to_string
        })

        if response['status'] === 'fail'
            raise response['message']
        end
    end
    def self.deleteStaff(staffId)
        response = request('/staff/delete', {
            staffId: staffId,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        if response['status'] === 'fail'
            raise response['message']
        end
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

    def self.logout()
      request('/user/logout')
    end

    def self.createTicket(title = 'Winter is coming',content = 'The north remembers')
        result = request('/ticket/create', {
            title: title,
            content: content,
            departmentId: 1,
            language: 'en',
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        result['data']
    end

    def self.closeTicket(ticketNumber)
        result = request('/ticket/close', {
            ticketNumber:ticketNumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        result['data']
    end

    def self.createAPIKey(name)
        request('/system/add-api-key', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: name
        })
    end

    def self.createTextCustomField(name,description)
        request('/system/add-custom-field', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: name,
            type: 'text',
            description: description
        })
    end
    def self.createTag(name, color)
        request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: name,
            color: color
        })
    end
    def self.assignTicket(ticketnumber)
        request('/staff/assign-ticket', {
            ticketNumber: ticketnumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
    end
    def self.commentTicket(ticketnumber,content)
        request('/ticket/comment', {
            content: content,
            ticketNumber: ticketnumber,
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })
    end
end
