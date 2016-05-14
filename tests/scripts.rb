class Scripts
    def self.createUser(email = 'steve@jobs.com', password = 'custompassword')
        response = request('/user/signup', {
            'email' => email,
            'password' => password
        })

        if response['status'] === 'fail'
            raise "Could not create user"
        end
    end
end
