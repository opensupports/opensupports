class Scripts
    def self.createUser(email = 'steve@jobs.com', password = 'custompassword', name = 'steve jobs')
        response = request('/user/signup', {
            'name' => name,
            'email' => email,
            'password' => password
        })

        if response['status'] === 'fail'
            raise "Could not create user"
        end
    end
end
