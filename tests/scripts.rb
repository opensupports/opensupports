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
    end

    def self.login(email = 'steve@jobs.com', password = 'custompassword')
        request('/user/logout')
        response = request('/user/login', {
            :email => email,
            :password => password
        })

        response['data']
    end
end
