$agent = Mechanize.new

def plainRequest(path, data = {}, method = 'POST')
    uri = 'http://localhost:8080' + path

    if method == 'POST'
        @response = $agent.post(uri, data)
    else
        @response = $agent.get(uri, data)
    end

    return @response
end

def request(path, data = {})
    uri = 'http://localhost:8080' + path
    response = $agent.post(uri, data)

    return JSON.parse(response.body)
end

class Database
    def initialize()
        mysqlHost = ENV['MYSQL_HOST'] || 'localhost'
        mysqlPort = ENV['MYSQL_PORT'] || '3306'
        mysqlUser = ENV['MYSQL_USER'] || 'root'
        mysqlPass = ENV['MYSQL_PASSWORD'] || ''
        @connection = Mysql.new(mysqlHost, mysqlUser,  mysqlPass, 'development', mysqlPort.to_i)
    end

    def close()
        @connection.close
    end

    def getRow(table, value, field = 'id')
        queryResponse = @connection.query("select * from #{table} where #{field}='#{value.to_s}'")

        return queryResponse.fetch_hash
    end

    def getLastRow(table)
        queryResponse = @connection.query("select * from #{table} order by id desc limit 1")

        return queryResponse.fetch_hash
    end

    def query(query_string)
        return @connection.query(query_string);
    end
end

class MailServer
    def initialize
        @smtp_server     = ENV['OPENSUPPORTS_SMTP_SERVER']
        @smtp_port       = ENV['OPENSUPPORTS_SMTP_PORT']

        @imap_server     = ENV['OPENSUPPORTS_IMAP_SERVER']
        @imap_port       = ENV['OPENSUPPORTS_IMAP_PORT']

        @admin_user      = ENV['OPENSUPPORTS_EMAIL_ADMIN_USERNAME']
        @admin_password  = ENV['OPENSUPPORTS_EMAIL_ADMIN_PASSWORD']

        @client_user     = ENV['OPENSUPPORTS_EMAIL_CLIENT_USERNAME']
        @client_password = ENV['OPENSUPPORTS_EMAIL_CLIENT_PASSWORD']

        @admin_imap = Net::IMAP.new(@imap_server, @imap_port, true)
        @client_imap = Net::IMAP.new(@imap_server, @imap_port, true)

        @admin_imap.login(@admin_user, @admin_password)
        @client_imap.login(@client_user, @client_password)

        @client_smtp = Net::SMTP.new(@smtp_server, @smtp_port).start(user=@client_user, secret=@client_password)
    end

    def clear_mails
        self.clear_admin_mails
        self.clear_client_mails
    end

    def clear_admin_mails
        @admin_imap.delete('INBOX')
    end

    def clear_client_mails
        @client_imap.delete('INBOX')
    end

    def send_mail(subject, text, file = nil)
        message = MailFactory.new
        message.to = @admin_user
        message.from = @client_user
        message.subject = subject
        message.html = text

        unless file.nil?
            message.attach(file)
        end

        @client_smtp.send_message(message.to_s, @client_user, @admin_user)
        Net::SMTP.start(@smtp_server, @smtp_port, @smtp_server, @client_user, @client_password) { |smtp|
            smtp.send_message(message.to_s, @client_user, @admin_user)
        }
    end
end

$mail_server = MailServer.new
$database = Database.new

$staff = {
    :email => 'staff@opensupports.com',
    :password => 'staff'
}
